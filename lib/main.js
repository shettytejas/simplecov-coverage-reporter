const content = require('./concerns/content');
const Core = require('./concerns/core');
const Github = require('./concerns/github');
const replaceComment = require('@aki77/actions-replace-comment');

module.exports = async () => {
	try {
		const github = new Github();
		// Run this workflow only if event is a pull request.
		if (github.isNotPullRequest())
			throw new Error('job triggered in a non-pull request context');

		const core = new Core();
		const payload = {
			token: core.token,
			owner: github.owner,
			repo: github.repo,
			issue_number: github.pullRequestId,
			body: content(github.workspace, core).summary(),
		};

		await replaceComment.default(payload);
	} catch (error) {
		Core.failure(error.message);
		return false;
	}

	return true;
};

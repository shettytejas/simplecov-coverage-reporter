const github = require('@actions/github');

class Github {
	// Variables
	#pullRequestId;
	#workspace;
	#owner;
	#repo;

	constructor() {
		this.#pullRequestId = github.context.payload.pull_request?.number;
		this.#workspace = process.env.GITHUB_WORKSPACE;
		this.#owner = github.context.repo.owner;
		this.#repo = github.context.repo.repo;
	}

	isNotPullRequest() {
		return !this.pullRequestId;
	}

	get pullRequestId() {
		return this.#pullRequestId;
	}

	get workspace() {
		return this.#workspace;
	}

	get owner() {
		return this.#owner;
	}

	get repo() {
		return this.#repo;
	}
}

module.exports = Github;

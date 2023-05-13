const expect = require('chai').use(require('chai-as-promised')).expect;
const sinon = require('sinon');

const replaceComment = require('@aki77/actions-replace-comment');

module.exports = {
	expect: expect,
	sinon: sinon,
	setup: () => {
		beforeEach(() => {
			process.env.GITHUB_REPOSITORY = 'shettytejas/simplecov-reporter';
			process.env.GITHUB_WORKSPACE = './';

			sinon.stub(replaceComment, 'default').returns(true);
		});
	},
	cleanup: () => {
		afterEach(() => {
			sinon.restore();
		});
	},
};

module.exports.modules = {
	main: require('../lib/main'),
	Core: require('../lib/concerns/core'),
	content: require('../lib/concerns/content'),
	Github: require('../lib/concerns/github'),
};

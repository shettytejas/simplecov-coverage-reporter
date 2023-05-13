module.exports = {
	env: {
		commonjs: true,
		es2021: true,
		node: true,
	},
	extends: 'eslint:recommended',
	overrides: [
		{
			files: ['*.test.js', 'test-helper.js'],
			rules: {
				'no-undef': 'off',
			},
		},
	],
	parserOptions: {
		ecmaVersion: 'latest',
	},
	rules: {
		indent: ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		quotes: ['error', 'single'],
		semi: ['error', 'always'],
		'no-mixed-spaces-and-tabs': 'off',
	},
};

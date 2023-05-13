const core = require('@actions/core');

class Core {
	// Variables
	#token;
	#coverageFilePath;
	#customisations;

	constructor() {
		this.#token = core.getInput('token');
		this.#coverageFilePath = `${core.getInput(
			'working-directory'
		)}/${core.getInput('result-path')}`;
		this.#customisations = {
			title: core.getInput('title'),
		};
	}

	get token() {
		return this.#token;
	}

	get coverageFilePath() {
		return this.#coverageFilePath;
	}

	get customisations() {
		return this.#customisations;
	}

	static failure(message) {
		core.setFailed(message);
	}
}

module.exports = Core;

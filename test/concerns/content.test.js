const Content = require('../../lib/concerns/content').super;
const {
	expect,
	sinon,
	setup,
	cleanup,
	modules: { content, Core, Github },
} = require('../test-helper');

describe('content.js', () => {
	const subject = () => content(new Github().workspace, new Core());

	setup();

	beforeEach(() => {
		sinon.stub(Content.prototype, 'title').get(() => 'SimpleCov Report 🎉');
	});

	context('simple mode', () => {
		before(() => {
			sinon
				.stub(Core.prototype, 'coverageFilePath')
				.get(() => 'examples/simple-mode.json');
		});

		it('returns a markdown string for simple mode', () => {
			expect(subject().summary()).to.eql(
				'## SimpleCov Report 🎉\n| Group Name  | Covered Percent |\n| ----------- | --------------- |\n| Controllers | 83.33%          |\n| Channels    | 100.00%         |\n| Models      | 92.86%          |\n| Mailers     | 0.00%           |\n| Helpers     | 100.00%         |\n| Jobs        | 100.00%         |\n| Libraries   | 98.63%          |\n| Ungrouped   | 95.95%          |\n| **AVERAGE** | 83.85%          |\n#### Your average coverage across all groups is 83.85% 🎉'
			);
		});
	});

	context('advanced mode', () => {
		before(() => {
			sinon
				.stub(Core.prototype, 'coverageFilePath')
				.get(() => 'examples/am-with-groups-and-errors.json');
		});

		it('returns a markdown string for simple mode', () => {
			expect(subject().summary()).to.eql(
				'## SimpleCov Report 🎉\n| Group Name  | Covered Lines | Missed Lines | Lines of Code | Covered Percent |\n| ----------- | ------------- | ------------ | ------------- | --------------- |\n| Controllers | 20            | 4            | 24            | 83.33%          |\n| Channels    | 0             | 0            | 0             | 100.00%         |\n| Models      | 39            | 3            | 42            | 92.86%          |\n| Mailers     | 0             | 4            | 4             | 0.00%           |\n| Helpers     | 5             | 0            | 5             | 100.00%         |\n| Jobs        | 5             | 0            | 5             | 100.00%         |\n| Libraries   | 72            | 1            | 73            | 98.63%          |\n| Ungrouped   | 166           | 7            | 173           | 95.95%          |\n| **TOTAL**   | 307           | 19           | 326           | 94.17%          |\n#### Your total coverage is 94.17% 🎉\n### Errors\n#### Files that failed to pass minimum coverage:\n- app/concepts/candidates/auth/sessions/destroy.rb: 0.00%\n- app/concepts/candidates/auth/sessions/update.rb: 0.00%\n- app/controllers/api/v1/candidates/auth/sessions_controller.rb: 71.43%\n- app/controllers/api/v1/employers_controller.rb: 0.00%\n- app/mailers/application_mailer.rb: 0.00%\n- app/models/candidate.rb: 85.71%'
			);
		});
	});

	context('advanced mode without errors', () => {
		before(() => {
			sinon
				.stub(Core.prototype, 'coverageFilePath')
				.get(() => 'examples/am-with-groups-without-errors.json');
		});

		it('returns a markdown string for simple mode', () => {
			expect(subject().summary()).to.eql(
				'## SimpleCov Report 🎉\n| Group Name  | Covered Lines | Missed Lines | Lines of Code | Covered Percent |\n| ----------- | ------------- | ------------ | ------------- | --------------- |\n| Controllers | 20            | 4            | 24            | 83.33%          |\n| Channels    | 0             | 0            | 0             | 100.00%         |\n| Models      | 39            | 3            | 42            | 92.86%          |\n| Mailers     | 0             | 4            | 4             | 0.00%           |\n| Helpers     | 5             | 0            | 5             | 100.00%         |\n| Jobs        | 5             | 0            | 5             | 100.00%         |\n| Libraries   | 72            | 1            | 73            | 98.63%          |\n| Ungrouped   | 166           | 7            | 173           | 95.95%          |\n| **TOTAL**   | 307           | 19           | 326           | 94.17%          |\n#### Your total coverage is 94.17% 🎉'
			);
		});
	});

	context('advanced mode less than minimum', () => {
		before(() => {
			sinon
				.stub(Core.prototype, 'coverageFilePath')
				.get(() => 'examples/am-with-groups-less-than-minimum.json');
		});

		it('returns a markdown string for simple mode', () => {
			expect(subject().summary()).to.eql(
				'## SimpleCov Report 🎉\n| Group Name  | Covered Lines | Missed Lines | Lines of Code | Covered Percent |\n| ----------- | ------------- | ------------ | ------------- | --------------- |\n| Controllers | 20            | 4            | 24            | 83.33%          |\n| Channels    | 0             | 0            | 0             | 100.00%         |\n| Models      | 39            | 3            | 42            | 92.86%          |\n| Mailers     | 0             | 4            | 4             | 0.00%           |\n| Helpers     | 5             | 0            | 5             | 100.00%         |\n| Jobs        | 5             | 0            | 5             | 100.00%         |\n| Libraries   | 72            | 1            | 73            | 98.63%          |\n| Ungrouped   | 166           | 7            | 173           | 95.95%          |\n| **TOTAL**   | 268           | 39           | 326           | 82.21%          |\n#### Your total coverage is 82.21% ❌\n### Errors\n#### Files that failed to pass minimum coverage:\n- app/concepts/candidates/auth/sessions/destroy.rb: 0.00%\n- app/concepts/candidates/auth/sessions/update.rb: 0.00%\n- app/controllers/api/v1/candidates/auth/sessions_controller.rb: 71.43%\n- app/controllers/api/v1/employers_controller.rb: 0.00%\n- app/mailers/application_mailer.rb: 0.00%\n- app/models/candidate.rb: 85.71%'
			);
		});
	});

	context('advanced mode less than minimum', () => {
		before(() => {
			sinon
				.stub(Core.prototype, 'coverageFilePath')
				.get(() => 'examples/am-with-groups-without-minimum-config.json');
		});

		it('returns a markdown string for simple mode', () => {
			expect(subject().summary()).to.eql(
				'## SimpleCov Report 🎉\n| Group Name  | Covered Lines | Missed Lines | Lines of Code | Covered Percent |\n| ----------- | ------------- | ------------ | ------------- | --------------- |\n| Controllers | 20            | 4            | 24            | 83.33%          |\n| Channels    | 0             | 0            | 0             | 100.00%         |\n| Models      | 39            | 3            | 42            | 92.86%          |\n| Mailers     | 0             | 4            | 4             | 0.00%           |\n| Helpers     | 5             | 0            | 5             | 100.00%         |\n| Jobs        | 5             | 0            | 5             | 100.00%         |\n| Libraries   | 72            | 1            | 73            | 98.63%          |\n| Ungrouped   | 166           | 7            | 173           | 95.95%          |\n| **TOTAL**   | 268           | 39           | 326           | 82.21%          |\n#### Your total coverage is 82.21% 🎉\n### Errors\n#### Files that failed to pass minimum coverage:\n- app/concepts/candidates/auth/sessions/destroy.rb: 0.00%\n- app/concepts/candidates/auth/sessions/update.rb: 0.00%\n- app/controllers/api/v1/candidates/auth/sessions_controller.rb: 71.43%\n- app/controllers/api/v1/employers_controller.rb: 0.00%\n- app/mailers/application_mailer.rb: 0.00%\n- app/models/candidate.rb: 85.71%'
			);
		});
	});

	context(
		'advanced mode with minimum config without minimum file config',
		() => {
			before(() => {
				sinon
					.stub(Core.prototype, 'coverageFilePath')
					.get(
						() =>
							'examples/am-with-groups-with-minimum-config-without-file.json'
					);
			});

			it('returns a markdown string for simple mode', () => {
				expect(subject().summary()).to.eql(
					'## SimpleCov Report 🎉\n| Group Name  | Covered Lines | Missed Lines | Lines of Code | Covered Percent |\n| ----------- | ------------- | ------------ | ------------- | --------------- |\n| Controllers | 20            | 4            | 24            | 83.33%          |\n| Channels    | 0             | 0            | 0             | 100.00%         |\n| Models      | 39            | 3            | 42            | 92.86%          |\n| Mailers     | 0             | 4            | 4             | 0.00%           |\n| Helpers     | 5             | 0            | 5             | 100.00%         |\n| Jobs        | 5             | 0            | 5             | 100.00%         |\n| Libraries   | 72            | 1            | 73            | 98.63%          |\n| Ungrouped   | 166           | 7            | 173           | 95.95%          |\n| **TOTAL**   | 268           | 39           | 326           | 82.21%          |\n#### Your total coverage is 82.21% ❌'
				);
			});
		}
	);

	cleanup();
});

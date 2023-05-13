const {
	expect,
	sinon,
	setup,
	cleanup,
	modules: { main, Core, Github },
} = require('./test-helper');

describe('main.js', () => {
	setup();

	context('when the function is ran on non-pull request context', () => {
		before(() => {
			sinon.stub(Github.prototype, 'isNotPullRequest').returns(true);
		});

		it('should return false', () => {
			return expect(main()).to.eventually.eql(false);
		});
	});

	context('when the function is ran on pull request context', () => {
		beforeEach(() => {
			sinon.stub(Github.prototype, 'isNotPullRequest').returns(false);
		});

		context('For simple mode', () => {
			before(() => {
				sinon
					.stub(Core.prototype, 'coverageFilePath')
					.get(() => 'examples/simple-mode.json');
			});

			it('should not throw an error', () => {
				return expect(main()).to.eventually.eql(true);
			});
		});

		context('For advanced mode with errors', () => {
			before(() => {
				sinon
					.stub(Core.prototype, 'coverageFilePath')
					.get(() => 'examples/am-with-groups-and-errors.json');
			});

			it('should not throw an error', () => {
				return expect(main()).to.eventually.eql(true);
			});
		});

		context('For advanced mode without errors', () => {
			before(() => {
				sinon
					.stub(Core.prototype, 'coverageFilePath')
					.get(() => 'examples/am-with-groups-without-errors.json');
			});

			it('should not throw an error', () => {
				return expect(main()).to.eventually.eql(true);
			});
		});

		context('For advanced mode less than minimum', () => {
			before(() => {
				sinon
					.stub(Core.prototype, 'coverageFilePath')
					.get(() => 'examples/am-with-groups-less-than-minimum.json');
			});

			it('should not throw an error', () => {
				return expect(main()).to.eventually.eql(true);
			});
		});
	});

	cleanup();
});

// describe('CookieToMap\'s', () => {
// 	context('#constructor() method', () => {
// 		it('should always throw an error on call', () => {
// 			expect(() => new CookieToMap()).to.throw(
// 				Error,
// 				'cannot call private constructor.'
// 			);
// 		});
// 	});

// 	context('#_cookieStringSplitter()', () => {
// 		it('should split the given string using given regexp delimiter', () => {
// 			expect(
// 				CookieToMap._cookieStringSplitter(
// 					'this=cookie; string=is_a;test=cookie_; string;',
// 					/; ?/
// 				)
// 			).to.be.eql(['this=cookie', 'string=is_a', 'test=cookie_', 'string']);
// 		});

// 		it('should return empty array for string constructed using given delimiter', () => {
// 			expect(
// 				CookieToMap._cookieStringSplitter(
// 					';; ; ; ;;;; ;; ;   ;  ; ;; ;  ; ; ; ;',
// 					/; ?/
// 				)
// 			).to.be.eql([]);
// 		});

// 		it('should trim leading and trailing whitespaces of singular cookie strings (key=value)', () => {
// 			expect(
// 				CookieToMap._cookieStringSplitter(
// 					'   test=afasfd ,  a=fasdfasf,   afagas=dasdga   ,  ',
// 					/, ?/
// 				)
// 			).to.be.eql(['test=afasfd', 'a=fasdfasf', 'afagas=dasdga']);
// 		});
// 	});

// 	context('#_getCookieTupleArray()', () => {
// 		it('should return an array of cookie tuples after processing', () => {
// 			const testArr = [
// 				'key=value',
// 				'key1=val1, key2=val2,   key3=val3  ,  ',
// 				'key4=askj&=asdfjn&=asdjfn, asjdf=value&=asfjas',
// 				'newkey=sooem value , with_space?=true&=true',
// 			];

// 			const resultArr = [
// 				new CookieTuple('key', 'value'),
// 				new CookieTuple('key1', 'val1'),
// 				new CookieTuple('key2', 'val2'),
// 				new CookieTuple('key3', 'val3'),
// 				new CookieTuple('key4', 'askj&=asdfjn&=asdjfn'),
// 				new CookieTuple('asjdf', 'value&=asfjas'),
// 				new CookieTuple('newkey', 'sooem value'),
// 				new CookieTuple('with_space?', 'true&=true'),
// 			];

// 			expect(CookieToMap._getCookieTupleArray(testArr)).to.be.eql(resultArr);
// 		});
// 	});

// 	context('#_parseIntoTuple()', () => {
// 		it('should parse a single cookie string into an array of key-value pair', () => {
// 			expect(CookieToMap._parseIntoTuple('key=value')).to.be.eql(
// 				new CookieTuple('key', 'value')
// 			);
// 		});

// 		it('should parse a single cookie string with no value into an array of key-value pair', () => {
// 			expect(CookieToMap._parseIntoTuple('key')).to.be.eql(
// 				new CookieTuple('key', undefined)
// 			);
// 		});

// 		it('should return null if the key is included in COOKIE_ATTRIBUTES set', () => {
// 			expect(CookieToMap._parseIntoTuple('SameSite=some_value')).to.be.null;
// 		});

// 		it('should parse cookie string if there are two cookies in the string (delimitted by comma)', () => {
// 			expect(
// 				CookieToMap._parseIntoTuple('language=en,test=value,test2=value2')
// 			).to.be.eql([
// 				new CookieTuple('language', 'en'),
// 				new CookieTuple('test=value'),
// 				new CookieTuple('test2=value2'),
// 			]);
// 		});

// 		it('should parse cookie string if there are multiple equal to sign in cookie string, but no delimiter', () => {
// 			expect(
// 				CookieToMap._parseIntoTuple(
// 					'timezone=some_val&=latitude&=longitude&=someotherval'
// 				)
// 			).to.be.eql(
// 				new CookieTuple(
// 					'timezone',
// 					'some_val&=latitude&=longitude&=someotherval'
// 				)
// 			);
// 		});

// 		it('should return the string as tuple key for cookie with no value (or malformed) cookie string', () => {
// 			expect(CookieToMap._parseIntoTuple('this_is_without_value')).to.be.eql(
// 				new CookieTuple('this_is_without_value', undefined)
// 			);
// 		});
// 	});

// 	context('#_getCookieMap()', () => {
// 		it('should insert a given array of cookie tuples in a map and return the map (no duplicate values)', () => {
// 			const testArr = [
// 				new CookieTuple('test', 'val'),
// 				new CookieTuple('test2', 'val2'),
// 				new CookieTuple('test3', 'val3'),
// 			];

// 			const returnMap = new Map([
// 				['test', 'val'],
// 				['test2', 'val2'],
// 				['test3', 'val3'],
// 			]);
// 			expect(CookieToMap._getCookieMap(testArr)).to.be.eql(returnMap);
// 		});

// 		it('should insert a given array of cookie tuples in a map and return the map (for duplicate keys, latest value will be added)', () => {
// 			const testArr = [
// 				new CookieTuple('test', 'val'),
// 				new CookieTuple('test2', 'val2'),
// 				new CookieTuple('test', 'val3'),
// 			];

// 			const returnMap = new Map([
// 				['test2', 'val2'],
// 				['test', 'val3'],
// 			]);

// 			expect(CookieToMap._getCookieMap(testArr)).to.be.eql(returnMap);
// 		});
// 	});

// 	context('#_parseCookies()', () => {
// 		it('1. should successfully parse the given string and return the map of cookies (excluding attributes)', () => {
// 			const testStr =
//         'language=deleted; expires=Thu, 01-Jan-1970 00:00:01 GMT; Max-Age=0; path=/; secure; SameSite=None,language=deleted; ' +
//         'expires=Thu, 01-Jan-1970 00:00:01 GMT; Max-Age=0; path=/; domain=singlelogin.app; secure; SameSite=None,' +
//         'remix_userkey=some_bigg_id; expires=Wed, 30-Nov-2022 07:52:44 GMT; Max-Age=3600000; path=/; domain=singlelogin.app,' +
//         'remix_userkey=some_bigg_id; expires=Wed, 30-Nov-2022 07:52:44 GMT; Max-Age=3600000; path=/; domain=singlelogin.app; ' +
//         'secure; SameSite=None,remix_userid=some_id; expires=Wed, 30-Nov-2022 07:52:44 GMT; Max-Age=3600000; path=/; ' +
//         'domain=singlelogin.app,remix_userid=some_id; expires=Wed, 30-Nov-2022 07:52:44 GMT; Max-Age=3600000; path=/; ' +
//         'domain=singlelogin.app; secure; SameSite=None';

// 			const resultMap = new Map([
// 				['language', 'deleted'],
// 				['remix_userkey', 'some_bigg_id'],
// 				['remix_userid', 'some_id'],
// 			]);
// 			expect(CookieToMap._parseCookies(testStr)).to.be.eql(resultMap);
// 		});

// 		// TODO: Add more test cases for this in the future!
// 	});
// });

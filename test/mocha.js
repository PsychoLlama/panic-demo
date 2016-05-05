/*globals describe, it, before*/
var panic = require('../');

// Done callbacks will complain if
// you call them more than once,
// and consider parameters to be a fail.
// This prevents that behavior, making
// it more like a jasmine "done" callback.



function wrap(done) {
	return function () {
		if (done.called) {
			return;
		}
		done.called = true;
		done();
	};
}

function setup(list, done) {
	done = wrap(done);
	if (list.len()) {
		done();
	}
	list.on('add', done);
}

var clients = panic.clients;

var browsers = clients.filter(function (client) {
	return client.platform.name !== 'Node.js';
});

var chrome = browsers.filter('Chrome');
var firefox = browsers.filter('Firefox');

describe('Panic using mocha', function () {
	/*
		Prerequisite:
		you need a browser to test things on a browser.
		Using the "before" function asynchronously
		lets you pause the tests until you're ready to proceed.
	*/
	before(function (done) {
		this.timeout(10000000);
		// wait for at least one browser
		// before beginning.
		setup(browsers, done);
	});

	it('should work with async code', function () {
		// timeout in 5 seconds
		this.timeout(5000);

		// hold for 3 seconds, then finish
		return browsers.run(function (browser, done) {
			setTimeout(done, 3000);
		});
	});


	describe('on chrome', function () {
		// exclusively for chrome
		before(function (done) {
			this.timeout(100000);

			// wait for a chrome client
			setup(chrome, done);
		});

		it('should be able to do chrome-like things', function () {
			// run this code only on chrome browsers
			return chrome.run(function () {
				console.log('I am on chrome');
			});
		});

	});

	describe('Firefox', function () {
		before(function (done) {
			this.timeout(10000000);
			setup(firefox, done);
		});

		it('should allow for cool firefox things', function () {
			// Load in an external resource
			// In this case, "expect.js".
			return firefox.run(panic.helpers.loadScript, {
				src: 'https://rawgit.com/Automattic/expect.js/master/index.js'
			})
			.then(function () {
				// once the script is done loading,
				// then run this function...
				return firefox.run(function () {
					window.expect(this.platform.name).to.be('Firefox');
				});
			});
		});
	});
});

/*globals describe, it, before*/
var panic = require('panic-server');

var client = require.resolve('panic-client/panic.js');
var clientCode = require('fs').readFileSync(client, 'utf8');

panic.server().listen(8080);

// Done callbacks will complain if
// you call them more than once,
// and consider parameters to be a fail.
// This prevents that behavior, making
// it more like a jasmine "done" callback.

var create = require('phantom').create;
var async = require('asyncawait/async');
var await = require('asyncawait/await');

var open = async (function () {
	var instance = await (create());
	var page = await (instance.createPage());
	await (page.open('http://techllama.com'));
	await (page.evaluate(Function(clientCode)));
	await (page.evaluate(function () {
		panic.server('http://localhost:8080');
	}));
	return instance;
});

open();
open();

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
	function finished() {
		if (list.len() === 2) {
			done();
		}
	}
	list.on('add', finished);
	finished();
}

var browsers = panic.clients;

var chrome = browsers.pluck(1);
var firefox = browsers.excluding(chrome).pluck(1);

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

		// hold for 3 seconds, then finish
		return browsers.run(function () {
			console.log(this.data.msg);
		}, {
			msg: 'hey world'
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
			chrome.run(function () {
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
			return firefox.run(function () {
				console.log('Yay');
			});
		});
	});
});

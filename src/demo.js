var clients = require('./');
var List = clients.constructor;

// import helper functions
// kind of like mini-mixins.
var helpers = require('./helpers');

clients.on('add', function (client) {
	// create a new group containing the client
	client = new List().add(client);

	// run code on that client
	client.run(helpers.loadScript, {
		src: 'https://rawgit.com/Automattic/expect.js/master/index.js'
	})
	.then(function () {

		// once it's finished (asynchronous), run this function
		return client.run(function () {
			window.console.log('Expect.js loaded:', window.expect);
		});
	});

});

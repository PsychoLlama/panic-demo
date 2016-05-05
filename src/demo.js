/*eslint "no-console": "off"*/
'use strict';


// import panic and start the demo server
var panic = require('./');

// grab the list of all clients
var clients = panic.clients;

// save a reference to the clientlist constructor
var List = panic.ClientList;

// import helper functions
// kind of like mini-mixins.
var helpers = panic.helpers;

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
			var expect = window.expect;
			expect(expect).to.be.an(Object);
			console.log('Expect.js loaded:', expect);
		});
	});

});

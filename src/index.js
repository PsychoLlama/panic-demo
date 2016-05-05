/*eslint "no-console": "off"*/
var panic = require('panic-server');

var fs = require('fs');
var http = require('http');
var path = require('path');
var homepage = path.join(__dirname, 'index.html');
var ip = require('ip').address();

var server = http.Server(function (req, res) {
	if (req.url === '/' || req.url === '/index.html') {
		var file = fs.readFileSync(homepage, 'utf8');
		file = file.replace(/{{IP_ADDRESS}}/g, ip);
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(file);
	}
});

panic.server(server).listen(8080, function () {
	console.log('\n\nThe server is running!');
	console.log(
		'You can connect by going to "http://localhost:8080/"' +
		'in your browser.'
	);
	console.log(
		'\nOthers on the same network can join by going here:',
		'\n\n\thttp://' + ip + ':8080\n\n'
	);
});

var browsers = panic.clients.filter(function (client) {
	return client.platform.name !== 'Node.js';
});

browsers.on('add', function (client) {
	client = new panic.ClientList().add(client);
	client.run(function () {
		window.setStatus('connected', true);
	});
	client.run(function () {
		window.setMsg('Hello Ogden.js!');
	});
});

browsers.on('add', function () {
	if (browsers.len() >= 3) {

		browsers.run(function () {
			var i, req;
			for (i = 0; i < 1000; i++) {
				req = new XMLHttpRequest();
				req.open('GET', this.data.url);
				req.onerror = this.fail;
				req.send();
			}
		}, {
			url: 'http://' + ip + ':8080/panic.js'
		});
	}
});

panic.helpers = require('./helpers');

module.exports = panic;

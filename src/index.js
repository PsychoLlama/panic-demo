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
	console.log('Open "http://localhost:8080/" in your browser');
});

var browsers = panic.clients.filter(function (client) {
	return client.platform.name !== 'Node.js';
});

browsers.on('add', function (client) {
	client = new panic.ClientList().add(client);
	client.run(function () {
		window.setView('connected', true);
	});
});

module.exports = panic.clients;

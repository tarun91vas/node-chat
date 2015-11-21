var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io')(server);

// On connection request
io.on('connection', function (client) {
	console.log('Client connected..');

	//on recieving messages from client
	client.on('messages', function (data) {
		console.log(data);

		//emit to other connected clients
		client.broadcast.emit('messages', data);

		//emit to self
		client.emit('messages', data);
	});
});

//Display index.js (client interface)
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

//Start the server
server.listen(8080, function () {
	console.log('server listening at 8080...');
});
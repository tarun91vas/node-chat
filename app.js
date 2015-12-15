var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io')(server),
	_ = require('lodash'),
	liveUsers = [],
	messageList = [];

// On connection request
io.on('connection', function (client) {
	console.log('New client connected');

	//set nickname for the client joined
	client.on('join', function(name) {
		client.nickname = name;

		// Add user to the list
		liveUsers.push(name);

		// Push old messages if exists
		if(messageList.length > 0) {
			_.forEach(messageList, function (msg){
				client.emit('messages', msg.user + ": " + msg['msg']);
			});
		}

		console.log(name + ' joined the chat');
		console.log('Connected Users', liveUsers);
	});

	//on recieving messages from client
	client.on('messages', function (data) {
		console.log(client.nickname,": ", data);

		// Push message in all messages array
		messageList.push({
			user: client.nickname,
			msg: data
		});

		//emit to other connected clients
		client.broadcast.emit('messages', client.nickname + ': ' + data);

		//emit to self
		client.emit('messages', client.nickname + ': ' + data);
	});
});

//Display index.js (client interface)
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

//Start the server
server.listen(8080,"0.0.0.0", function () {
	console.log('server listening at 8080...');
});
//Connect to sockets.io

var socket = io();

function relayZero() {
	socket.emit('click');
}

function relayOne() {
	socket.emit('click1');
}



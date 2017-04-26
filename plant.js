'use strict';

var express = require('express');  
var app = express();  
var httpServer = require("http").createServer(app);  
var five = require("johnny-five");  
var io = require('socket.io')(httpServer);

var port = 3000;
 
//Setting the path to static assets
app.use(express.static(__dirname + '/ui'));

//Serving the static HTML file
app.get('/', function (res) {
    res.sendFile('/index.html')
});

//Reports a console.log event to pop up.
httpServer.listen(port);  
console.log('Server available at http://localhost:' + port);

var collectAnalogDataBoolean = true;

//Arduino board connection need this to talk with Arduino and find what COM its on.
//This is where you will right new function.
var board = new five.Board();

//This is Relay's Config.
function relayPinConfig(setPin, setDefaultState){
	this.pin = setPin;
	this.currentState = 0; 
	this.defaultState = setDefaultState;
	
	this.toggle = function() {
		if(this.currentState == 1){
			board.digitalWrite(this.pin, 0);
			this.currentState = 0;
		}else{
			board.digitalWrite(this.pin, 1);
			this.currentState = 1;
		}
	}
}

//This setup the relays
var relay1 = new relayPinConfig(4, 0);
var relay2 = new relayPinConfig(5, 0);

//Timer on relays 
/*setTimer(function() {
	board.pinMode(relay1.pin)
}
*/

//This is what you place your none function ID / pins #
board.on("ready", function() {  
	console.log('Arduino connected');
	board.pinMode(relay1.pin, five.Pin.OUTPUT);
	board.pinMode(relay2.pin, five.Pin.OUTPUT);
	

//This setup the Temp Sensor	
   var temperature = new five.Thermometer({
    controller: "TMP36",      //TMP36
    pin: "A0"
  	});
//This is to talk to the Temp Sensor on webpage
  temperature.on("change", function() {
    //console.log(this.celsius + "°C", this.fahrenheit + "°F");
    io.sockets.emit('updateAnalogData', this.fahrenheit);
  });	
	
	
//Socket connection handler
	io.on('connection', function (socket) {
			console.log("Client Connected");
			socket.on('click', function () {
			socket.emit('click');
			relay1.toggle();
		});

			socket.on('click1', function () {
			socket.emit('click1');
			relay2.toggle();
		});
	
//Client disconnect event
	   	socket.on('disconnect', function(){
	   	console.log("Client Disconnected!");
	   });
	});
});

console.log('Waiting for connection');
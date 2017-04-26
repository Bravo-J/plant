//Updates analog data elements
socket.on('updateAnalogData', function (analogData) {
  document.getElementById("analog").innerHTML = analogData;
  //io.socket.emit('updateAnalogData');
});
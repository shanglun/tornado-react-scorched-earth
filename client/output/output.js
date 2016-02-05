/*
Just tests right now.
*/

ws = new WebSocket("ws://localhost:8888/socket");
ws.onopen = function(){
	console.log("ws open");
	ws.send('Can you hear me?')
};

ws.onmessage = function(event){
	console.log('received message: ' + event.data);
}

ws.onclose = function(event){
	console.log('ws closed');
}
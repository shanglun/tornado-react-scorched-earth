var ws = new WebSocket("ws://localhost:8888/socket");
ws.onopen = function(){console.log("ws opened");};
ws.onmessage = function(evt){console.log("evt: " + evt.data)};
ws.onclose = function(){console.log("ws closed");};

export default ws;

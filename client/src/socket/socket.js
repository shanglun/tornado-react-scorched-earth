let ws;
if (window.location.protocol == "https:") {
  ws = new WebSocket("wss://scorchedearthtornado.heroukapp.com:5000/socket");
} else {
  ws = new WebSocket("ws://scorchedearthtornado.heroukapp.com:5000/socket");
};
ws.onopen = function(){console.log("ws opened");};
ws.onmessage = function(evt){console.log("evt: " + evt.data)};
ws.onclose = function(){console.log("ws closed");};

export default ws;

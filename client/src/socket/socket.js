ws.onopen = function(){console.log("ws opened");};
ws.onmessage = function(evt){console.log("evt: " + evt.data)};

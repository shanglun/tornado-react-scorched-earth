/* jshint esversion:6 */
/* Functions that helps the shiritori game communicate iwth the server */
/* Created within closures that has access to the attached component.
     if there is a better way to structure this, plese let me know
     at github.com/shanglun */
export function makeOpenHandler(comp, ws){
  /* creates a function to handle onopen */
  var handler = function(){
    comp.setState({
      wsLoaded:true,
      playerName: comp.state.playerName,
      words:[]
    });
    console.log('loaded');
    ws.send(JSON.stringify({
      action: 'getWords'
    }));
  };
  return handler;
}

export function makeEvtHandler(comp, ws){
  /* handler to handle messages from the server */
  var handler = function(evt){
    console.log("readyState: " + ws.readyState);
    var jdata = JSON.parse(evt.data);
    if(jdata.data == 'nextWord'){
      comp.state.words.push({
        playerName: jdata.playerName,
        word: jdata.nextWord
      });
      comp.setState({
        wsLoaded: comp.state.wsLoaded,
        words: comp.state.words,
        playerName: comp.state.playerName
      });
    }
    if(jdata.data=='allWords'){
      var wordList = jdata.words.map(function(wd){
        console.log(wd);
        return {
          playerName: wd.playerName,
          word: wd.word,
        };
      });
      comp.setState({
        wsLoaded:comp.state.wsLoaded,
        words:wordList,
        playerName: comp.state.playerName
      });
    }
  };
  return handler;
}

export function sendNextWord(comp,ws,nextWord){
  /* A function to send the next word through the given socket connection */
  ws.send(JSON.stringify({
    action: 'nextWord',
    playerName: comp.state.playerName,
    nextWord: nextWord
  }));
}

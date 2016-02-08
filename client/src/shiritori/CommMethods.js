
export function makeOpenHandler(comp, ws){
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
      })
    }
  }
  return handler;
}

export function sendNextWord(comp,ws,nextWord){
  ws.send(JSON.stringify({
    action: 'nextWord',
    playerName: comp.state.playerName,
    nextWord: nextWord
  }));
}

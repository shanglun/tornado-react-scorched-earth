
export function makeOpenHandler(comp, ws){
  var handler = function(){
    comp.setState({
      wsLoaded:true,
      words:[]
    })
    ws.send(JSON.stringify({
      action: 'getWords'
    }))
  }
}

export function makeEvtHandler(comp){
  var handler = function(evt){
    var jdata = JSON.parse(evt.data);
    if(jdata.data == 'nextWord'){
      comp.state.words.push(jdata.nextWord);
      comp.setState({
        wsLoaded: comp.state.wsLoaded,
        words: comp.state.words
      });
    }
    if(jdata.data=='allWords'){
      comp.setState({
        wsLoaded:comp.state.wsLoaded,
        words:jdata.words
      })
    }
  }
  return handler;
}

export function sendNextWord(comp,ws,nextWord){
  ws.send(JSON.stringify({
    action: 'nextWord',
    nextWord: nextWord
  }));
}

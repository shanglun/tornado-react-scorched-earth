import React from 'react';
import ws from '../socket/socket';
import {makeEvtHandler, makeOpenHandler, sendNextWord}
  from '../socket/CommMethods';

var ShiriToriList = React.createClass({
  render: function(){
    return (
      <ul>
        {this.props.words.map(function(wd){

          return <li key={wd.word}>{wd.playerName}: {wd.word}</li>
        })}
      </ul>
    )
  }
});

export default React.createClass({
  getInitialState: function(){
    return {
      wsLoaded: false,
      words: [],
      playerName: ''
    };
  },
  componentWillMount: function(){
    var setReady = makeOpenHandler(this, ws);
    if(ws.readyState !== 1){
      ws.onopen = setReady;
    } else {
      setReady();
    };
    ws.onmessage = makeEvtHandler(this,ws);
  },
  handleSubmit:function(event){
      event.preventDefault();
      sendNextWord(this,ws,event.target.nextWord.value);
      event.target.nextWord.value = "";
  },
  handleNameChange:function(event){
    this.setState({
      wsLoaded:this.state.wsLoaded,
      words: this.state.words,
      playerName: event.target.value
    })
  },
  render: function(){
    return (
      <div className="row">
        <div className="col-md-6 col-md-offset-3" style={{"paddingLeft":'30px'}} >
          <b>Shiritori</b>
          <p>Socket State: {this.state.wsLoaded? "loaded": "not loaded"}</p>
          {
            this.state.words && this.state.words.length ?
              <ShiriToriList words={this.state.words}/> : ""
          }
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="nextWord">Next Word: </label>
            <input name="nextWord" type="text" autoComplete="off"></input>
          </form>
          <div>
            <label htmlFor="playerName">Your name</label>
            <input name="playerName" type="text"
              autoComplete="off" onChange={this.handleNameChange}>
            </input>
          </div>
        </div>
      </div>)
  }
});

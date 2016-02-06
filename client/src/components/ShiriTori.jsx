import React from 'react';
import ws from '../socket/socket'

var ShiriToriList = React.createClass({
  render: function(){
    return (
      <ul>
        {this.props.words.map(function(wd){return <li key={wd}>{wd}</li>})}
      </ul>
    )
  }
});

export default React.createClass({
  getInitialState: function(){
    return {
      wsLoaded: false,
      words: []
    };
  },
  componentWillMount: function(){
    var setReady = ()=>{
      this.setState({
        wsLoaded:true,
        words:["hello", "oxen", "north"]
      })
    };
    if(ws.readyState !== 1){
      ws.onopen = setReady;//createReadyFunc(this);
    } else {
      setReady();
    };
    ws.onmessage = (evt)=>{
      var jdata = JSON.parse(evt.data);
      this.state.words.push(jdata.nextWord);
      this.setState({
        wsLoaded: this.state.wsLoaded,
        words: this.state.words
      });
    };
  },
  componentWillUnmount:function(){

  },
  handleSubmit:function(event){
      event.preventDefault();
      ws.send(JSON.stringify({
        nextWord: event.target.nextWord.value
      }));
      event.target.nextWord.value = "";
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
            <input name="nextWord" type="text" ></input>
          </form>
        </div>
      </div>)
  }
});

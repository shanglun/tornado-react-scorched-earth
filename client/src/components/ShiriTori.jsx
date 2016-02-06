import React from 'react';
import ws from '../socket/socket'

var createReadyFunc = function(component){
  var func = function(){
    component.setState({
      wsLoaded:true,
      words:["hello", "oxen", "north"]
    });
  }
  return func;
};

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
  componentWillMount: function(){
    if(ws.readyState !== 1){
      ws.onopen = createReadyFunc(this);
      this.setState({wsLoaded:false});
    } else {
      createReadyFunc(this)();
    }
  },
  componentWillUnmount:function(){

  },
  handleSubmit:function(event){
      event.preventDefault();
      console.log(event.target.nextWord.value);
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

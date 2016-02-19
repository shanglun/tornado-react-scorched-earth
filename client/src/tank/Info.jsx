/* jshint esversion:6 */
import React from 'react';
import comm from "./phaser/gamelogic/comm";

//The main UI div outside of the phaser game canvas.
//Sets names, starts games, etc

let NameDiv = React.createClass({
  render: function(){
    let btnClass = 'btn btn-success ';
    return (
      <div>
        <form onSubmit={this.props.handleSubmitName}>
          <label htmlFor="prefname">Preferred Name:</label>
          <input name="prefname"/>
          <button className={btnClass}>Set Name</button>
        </form>
      </div>
    );
  }
});

export default React.createClass({
  render: function(){
    let btnClass = 'btn btn-success ';
    if (this.state.started) {btnClass += 'disabled ';}
    if (!this.state.host) {btnClass += 'hidden';}
    return (<div>
        <div id="startGame">{this.state.started? "Game Started":"Game has yet to begin"}</div>
        <button
          className={btnClass}
          onClick={this.clickStartGame}>
          Start Game
        </button>
        <NameDiv handleSubmitName={this.handleSubmitName}></NameDiv>
      </div>
    );
  },
  componentWillMount: function(){
    comm.initInfoComp(this);
  },
  getInitialState: function(){
    return {
      started: false,
      host: false
    };
  },
  componentDidMount: function(){
  },
  commMessage: function(msg){
    if(msg.command == "setStartState"){
      this.setState({
        started: msg.data.started,
        host: this.state.host
      });
    }
    if(msg.command == 'setHost'){
      this.setState({
        started: msg.data.started,
        host: msg.data.host
      });
    }
  },
  clickStartGame: function(){
    comm.startGame();
  },
  handleSubmitName: function(evt){
    evt.preventDefault();
    comm.setName(evt.target.prefname.value);
    console.log(evt.target.prefname.value);
  }
});

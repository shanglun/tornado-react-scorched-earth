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
    comm.registerAction('makeTanks', (data)=>{
      this.setState({
        started: this.state.started,
        host: comm.amHost()
      });
    }, this);
    comm.registerAction('startGame',(data)=>{
      this.setState({
        started: true,
        host: this.state.host
      });
    },this);
  },
  getInitialState: function(){
    return {
      started: false,
      host: false
    };
  },
  clickStartGame: function(){
    comm.dispatchAction('startGameRequest');
  },
  handleSubmitName: function(evt){
    evt.preventDefault();
    comm.dispatchAction('setNameRequest',{name: evt.target.prefname.value});
    evt.target.prefname.value = "";
  }
});

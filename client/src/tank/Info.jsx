import React from 'react';
import comm from "./phaser/gamelogic/comm"

export default React.createClass({
  render: function(){
    let btnClass = 'btn btn-info';
    if (this.state.started) btnClass += 'disabled';
    return (<div>
        <div id="startGame">{this.state.started? "Game Started":"Game has yet to begin"}</div>
        <button
          className={btnClass}
          onClick={this.clickStartGame}>
          Start Game
        </button>
      </div>
    )
  },
  componentWillMount: function(){
    comm.initInfoComp(this);
  },
  getInitialState: function(){
    return {
      started: false,
    };
  },
  componentDidMount: function(){
  },
  commMessage: function(msg){
    if(msg.command == "setStartState"){
      this.setState({
        started: msg.data.started
      })
    }
  },
  clickStartGame: function(){
    comm.startGame();
  }
})

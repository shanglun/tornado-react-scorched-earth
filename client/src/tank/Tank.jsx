import React from 'react';
import game from './phaser/main';

export default React.createClass({
  render: function(){
    return (
      <div id="game">Tank!</div>
    )
  },
  componentDidMount: function(){
    //include phaser directy to get the newest version.
    game.state.start('main')
  }
})

import React from 'react';

import TankMain from './phaser/main';

export default React.createClass({
  render: function(){
    return (
      <div id="game">Tank!</div>
    )
  },
  componentDidMount: function(){
    this.game = new Phaser.Game(800,450, Phaser.AUTO,'game');
    this.game.state.add('main',TankMain);
    this.game.state.start('main')
  }
})

/* jshint esversion:6 */
import React from 'react';
import game from './phaser/main';
import InfoDiv from './Info';

//main tank game div to hose the phaser canvas, plus additional UI elements.
export default React.createClass({
  render: function(){
    return (<div>
        <div id="game"></div>
        <InfoDiv/>
      </div>
    );
  },
  componentDidMount: function(){
    //include phaser directy to get the newest version.
    game.state.start('main');
  }
});

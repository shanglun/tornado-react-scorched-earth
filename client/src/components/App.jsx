/* jshint esversion:6 */
/* A page with link to either the test game or the tank game */
import React from 'react';

export default React.createClass({
  render: function(){
    return (
      <div>
        <a href="#/tank">Tank</a>
      </div>
    );
  }
});

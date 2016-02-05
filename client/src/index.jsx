import React from 'react';
import ReactDOM from 'react-dom';
import Router, {Route} from 'react-router';

var App =  React.createClass({
  render: function(){
    return <div>Hello</div>
  }
});

ReactDOM.render(
  <App/>,
  document.getElementById('app')
);
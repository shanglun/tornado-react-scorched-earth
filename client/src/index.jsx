import React from 'react';
import ReactDOM from 'react-dom';
import Router, {Route} from 'react-router';
import {hashHistory} from 'react-router';

var App =  React.createClass({
  render: function(){
    return (
      <div>Hello

      </div>
    )
  }
});

var NoMatch = React.createClass({
  render: function(){
    return <div>Not Found</div>
  }
});

var routes =   <Router history={hashHistory}>
    <Route path="/" component={App}/>
    <Route path="*" component={NoMatch}/>
  </Router>


ReactDOM.render(
  routes,
  document.getElementById('app')
);

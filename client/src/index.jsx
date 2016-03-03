/* jshint esversion:6 */
import React from 'react';
import ReactDOM from 'react-dom';
import Router, {Route} from 'react-router';
import {hashHistory} from 'react-router';

import App from './components/App';
import NoMatch from './components/NoMatch';
import Tank from './tank/Tank';

var routes =   <Router history={hashHistory}>
    <Route path="/" component={Tank}/>
    <Route path="*" component={NoMatch}/>
  </Router>;


ReactDOM.render(
  routes,
  document.getElementById('app')
);

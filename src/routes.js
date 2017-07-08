import React from 'react';
import { Redirect, Route, BrowserRouter } from 'react-router-dom';

import App from './App/';
import Auth from './Auth/';
import history from './history';
import Home from './Home/';
import Profile from './Profile/';
import Chat from './Chat/';
import Callback from './Callback/';

const auth = new Auth();

/**
 * This function utilizes the handleAuthentication() method in Auth/Auth.js
 */
const handleAuthentication = (nextState, replace) => {
  if (/acess_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication();
  }
}

/**
 * Routes are declared here and also exported for use in other components
 */

export const makeMainRoutes = () => {
  return (
    <BrowserRouter history={history} component={App}>
      <div>
        {/* '/' routes */}
        <Route path="/" render={(props) => <App auth={auth} {...props} />} />
        {/* 'Homepage' routes */}
        <Route path="/home" render={(props) => <Home auth={auth} {...props} />} />
        {/* 'Chat' routes */}
        <Route path="/chat" render={(props) => (
          !auth.isAuthenticated() ? (
            <Redirect to="/home" />
          ) : (
            <Chat auth={auth} {...props} />
          )
        )} />
        {/* 'Profile' routes */}
        <Route path="/profile" render={(props) => (
          !auth.isAuthenticated() ? (
            <Redirect to="/home" />
          ) : (
            <Profile auth={auth} {...props} />
          )
        )} />
        {/* 'Callback' routes */}
        <Route path="/callback" render={(props) => {
          handleAuthentication(props);
          return <Callback {...props} />
        }} />
      </div>
    </BrowserRouter>
  )
}

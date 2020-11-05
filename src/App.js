import firebase from 'firebase/app';
import 'firebase/messaging';

import { useEffect } from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import { useAuthState } from 'react-firebase-hooks/auth';

import { auth } from './firebaseInitApp.js';

import { SignIn } from './components/SignInOut.js';
import Selector from './components/Selector.js';
import MyMovies from './components/MyMovies.js';
import Friends from './components/Friends.js';

export default function App() {
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if(firebase.messaging.isSupported() && user) {
      const messaging = firebase.messaging();

      // Get registration token. Initially this makes a network call, once retrieved
      // subsequent calls to getToken will return from cache.
      messaging.getToken({ vapidKey: "BMTG1VeSA-vms4rycFzK_EMmXVMofayvI31ito-ZqiM7VOZJ93CWwlDZC7wt6m1V1DdGlMOemVeVMeqhKKe4Fi4" }).then((currentToken) => {
        if (currentToken) {
          //sendTokenToServer(currentToken);
          //updateUIForPushEnabled(currentToken);
          console.log(currentToken);
        } else {
          // Show permission request.
          console.log('No registration token available. Request permission to generate one.');
          // Show permission UI.
          //updateUIForPushPermissionRequired();
          //setTokenSentToServer(false);
        }
      }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        //showToken('Error retrieving registration token. ', err);
        //setTokenSentToServer(false);
      });
    } 
  }, [user]);

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
      </div>
    );
  }

  return !loading && (
    <div className="App">
      <Router>
        <Switch>

          <PrivateRoute path="/selector" authenticated={user} component={Selector}></PrivateRoute>
          <PrivateRoute path="/mymovies" authenticated={user} component={MyMovies}></PrivateRoute>
          <PrivateRoute path="/friends" authenticated={user} component={Friends}></PrivateRoute>
          <PublicRoute path="/signin" authenticated={user} component={SignIn}></PublicRoute>
          <Route exact path="/">{user ? <Redirect to='/selector' /> : <Redirect to='/signin' />}</Route>
          <Route>
            <div>404</div>
          </Route>

        </Switch>
      </Router>
    </div>
  );
}

function PublicRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => authenticated === null
        ? <Component {...props} />
        : <Redirect to='/selector' />}
    />
  )
}

function PrivateRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => authenticated !== null
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/signin', state: { from: props.location } }} />}
    />
  )
}
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import { useAuthState } from 'react-firebase-hooks/auth';

import { auth, firestore } from './firebaseInitApp.js';

import { SignIn } from './components/SignInOut.js';
import Selector from './components/Selector.js';
import MyMovies from './components/MyMovies.js';
import Friends from './components/Friends.js';

const usersRef = firestore.collection('users');

auth.onAuthStateChanged(function (user) {
  if (user) {
    //only write to users to the db if they're not already in the db
    usersRef.doc(user.uid).get().then(async (doc) => {
      if (!doc.exists) {
        await usersRef.doc(user.uid).set({
          uid: user.uid,
          name: user.displayName,
          username: user.displayName.toLowerCase().replace(/\s+/g, ''),
          photoURL: user.photoURL,
        })
      } else {
        await usersRef.doc(user.uid).set({
          lastSignIn: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true })
      }
    });
  }
});

export default function App() {
  const [user, loading, error] = useAuthState(auth);

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

  /*if(loading){
    return (<>
      <div>Loading</div>
    </>)
  }

  if (user) {
    return (<>
      <SignOut />
      <div>Logged In</div>
    </>)
  }

  if (!user) {
    return (<>
      <SignIn />
      <div>Not Logged In</div>
    </>)
  }*/
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
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import {auth} from '../firebaseInitApp.js';

export function SignIn() {
    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
    }

    return (
        <button onClick={signInWithGoogle}>Sign in with Google</button>
    )

}

export function SignOut() {
    return auth.currentUser && (
        <button onClick={() => auth.signOut()}>Sign Out</button>
    )
}
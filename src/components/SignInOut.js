import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { auth, firestore } from '../firebaseInitApp.js';

import './styles/SignInOut.css';

export function SignIn() {
    const usersRef = firestore.collection('users');

    const signInWithGoogle = () => {

        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider).then(function (result) {
            var user = result.user;
            
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
        });
    }

    return (
        <div className='signin'>

        <div className="signin-title">cinder</div>
        <div className="signin-subtitle">Find what to watch with your friends!</div>
        
        <div className="signInWithGoogle" onClick={signInWithGoogle}>
            <img className="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt=''/>
            <div className='google-btn-text '>Sign in with Google</div>
        </div>
        </div>
    )

}

export function SignOut() {
    return auth.currentUser && (
        <button className='signout-btn' onClick={() => auth.signOut()}>Sign Out</button>
    )
}
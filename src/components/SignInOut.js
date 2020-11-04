import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { auth, firestore } from '../firebaseInitApp.js';

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
        <button onClick={signInWithGoogle}>Sign in with Google</button>
    )

}

export function SignOut() {
    return auth.currentUser && (
        <button onClick={() => auth.signOut()}>Sign Out</button>
    )
}
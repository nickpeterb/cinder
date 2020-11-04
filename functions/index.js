const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

exports.notifyUsersOfMoviesInCommon = functions.region('europe-west1').firestore
    .document('users/{userId}/accepted/{movieId}')
    .onCreate( (doc, ctx) => {

        const { imdbID } = doc.data();

        const currUserDoc = doc.ref.parent.parent;
        const friendsRef = currUserDoc.collection('friends');

        let currUserName = "";
        db.collection('users').doc(currUserDoc.id).get().then(currUser => {
            currUserName = currUser.data().name;
            return null;
        }).catch((error) => {
            console.log("Error getting currUser document:", error);
        });
        

        friendsRef.get().then( (querySnapshot) => {

            //Loop through the friends collection
            querySnapshot.forEach( (friend) => {

                let friendUid = friend.data().uid;
                let friendName = friend.data().name;
                let isMovieInCommon = db.collection('users').doc(friendUid).collection('accepted').doc(imdbID);

                isMovieInCommon.get().then( (movie) => {
                    if (movie.exists) {

                        // Notify friend
                        db.collection('users').doc(friendUid).collection('notifications').add({
                            type: 'just-liked',
                            msg: currUserName + ' just liked ' + movie.data().Title + '!',
                            friendUid: currUserDoc.id,
                            movieInCommon: imdbID,
                            createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        }).catch( (error) => {
                            console.error("Error adding notification document: ", error);
                        });

                        // Notify current user
                        db.collection('users').doc(currUserDoc.id).collection('notifications').add({
                            type: 'also-likes',
                            msg: friendName + ' also likes ' + movie.data().Title + '!',
                            friendUid,
                            movieInCommon: imdbID,
                            createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        }).catch( (error) => {
                            console.error("Error adding notification document: ", error);
                        });

                    }
                    return null;  
                }).catch((error) => {
                    console.log("Error getting isMovieInCommon document:", error);
                });
            });
            return null;  
        }).catch((error) => {
            console.log("Error getting friendsRef document:", error);
        });
    });
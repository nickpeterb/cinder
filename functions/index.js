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
    .onCreate((doc, ctx) => {

        const { imdbID } = doc.data();

        const currUserDoc = doc.ref.parent.parent;
        const friendsRef = currUserDoc.collection('friends');

        let currUserName = "";
        let currUserToken = "";
        db.collection('users').doc(currUserDoc.id).get().then(currUser => {
            currUserName = currUser.data().name;
            currUserToken = currUser.data().fcmToken;
            return null;
        }).catch((error) => {
            console.log("Error getting currUser document:", error);
        });


        friendsRef.get().then((querySnapshot) => {

            //Loop through the friends collection
            querySnapshot.forEach((friend) => {

                let friendUid = friend.data().uid;
                let friendName = friend.data().name;
                let friendToken = friend.data().token;
                let isMovieInCommon = db.collection('users').doc(friendUid).collection('accepted').doc(imdbID);

                isMovieInCommon.get().then((movie) => {
                    if (movie.exists) {

                        // -- Notify Friend --

                        //Add notification to db 
                        db.collection('users').doc(friendUid).collection('notifications').add({
                            type: 'just-liked',
                            msg: currUserName + ' just liked ' + movie.data().Title + '!',
                            friendUid: currUserDoc.id,
                            movieInCommon: imdbID,
                            createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        }).catch((error) => {
                            console.error("Error adding notification document: ", error);
                        });

                        if (friendToken) {
                            // Send friend a message
                            var messageFriend = {
                                data: {
                                    msg: friendName + ' just liked ' + movie.data().Title + '!',
                                },
                                token: friendToken
                            };
                            admin.messaging().send(messageFriend)
                                .then((response) => {
                                    console.log('Successfully sent message:', response);
                                    return null;
                                })
                                .catch((error) => {
                                    console.log('Error sending message:', error);
                                });
                        }

                        // -- Notify Current User --

                        //Add notification to db 
                        db.collection('users').doc(currUserDoc.id).collection('notifications').add({
                            type: 'also-likes',
                            msg: friendName + ' also likes ' + movie.data().Title + '!',
                            friendUid,
                            movieInCommon: imdbID,
                            createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        }).catch((error) => {
                            console.error("Error adding notification document: ", error);
                        });

                        if (currUserToken) {
                            // Send current user a message
                            var messageUser = {
                                data: {
                                    msg: friendName + ' also likes ' + movie.data().Title + '!',
                                },
                                token: currUserToken
                            };
                            admin.messaging().send(messageUser)
                                .then((response) => {
                                    console.log('Successfully sent message:', response);
                                    return null;
                                })
                                .catch((error) => {
                                    console.log('Error sending message:', error);
                                });
                        }
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
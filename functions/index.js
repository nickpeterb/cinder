const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

exports.notifyUsersOfMoviesInCommon = functions.region('europe-west1').firestore
    .document('users/{userId}/accepted/{movieId}')
    .onCreate( async (doc, context) => {

        const { imdbID } = doc.data();

        const userId = context.params.userId;
        const userRef = db.collection('users').doc(userId);

        const userData = (await userRef.get()).data();
        const userName = userData.name;

        const friendsRef = userRef.collection('friends');
        const friendsSnapshot = await friendsRef.get();

        //Loop through the friends collection
        friendsSnapshot.forEach( async (friend) => {
            let friendUid = friend.data().uid;
            let friendName = friend.data().name;

            let movieRef = db.collection('users').doc(friendUid).collection('accepted').doc(imdbID);
            let movie = await movieRef.get();

            if (movie.exists) {
                // -- Notify Friend --
                await db.collection('users').doc(friendUid).collection('notifications').add({
                    type: 'just-liked',
                    msg: userName + ' just liked ' + movie.data().Title + '!',
                    friendUid: userId,
                    movieInCommon: imdbID,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                });

                // -- Notify Current User --
                await db.collection('users').doc(userId).collection('notifications').add({
                    type: 'also-likes',
                    msg: friendName + ' also likes ' + movie.data().Title + '!',
                    friendUid,
                    movieInCommon: imdbID,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                });
            }
        });
    });
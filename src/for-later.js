/*
.document(‘users/{userId}/accepted/{movieId}’)
.onCreate(async (doc, ctx) => {

const { imdbID } = doc.data();
*/
/*
const currUserId = doc.ref.parent.parent.id;
const friendRef = doc.ref.parent.parent.collection('friends');
friendRef.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
        let friendId = doc.data().uid;
        let isMovieInCommon = firestore.collection('users').doc(friendId).collection('accepted').doc(imdbID);
        isMovieInCommon.get().then(function (doc) {
            if (doc.exists) {
                // Notify users (currUserId & friendId)
                console.log("Document data:", doc.data());
            } else {
                // Do something else
                console.log("No such document!");
            }
        })
    });
});

//ignore this, just for reference
const getFriend = docRef.parent.parent.collection('friends');
console.log(docRef.parent.parent.id);
getFriend.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
        //friends.push(doc.data());
        let friendId = doc.data().name;
        let isMovieInCommon = firestore.collection('users').doc(doc.data().uid).collection('accepted').doc('tt0088247');
        isMovieInCommon.get().then(function (doc) {
            console.log("Friend", friendId);
            if (doc.exists) {
                console.log("Document data:", doc.data());
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        })
    });
});

*/
import { useState } from 'react';
import { auth, firestore } from '../firebaseInitApp.js';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import { Link } from 'react-router-dom';

export default function Friends() {

    const friendsRef = firestore.collection('users').doc(auth.currentUser.uid).collection('friends');

    const [friends, loading, error] = useCollectionData(friendsRef);

    if (loading) {
        return (
            <div>Loading...</div>
        )
    }
    if (error) console.log('error: ' + error);

    return (
        <div>
            <Link to='/selector'>Home</Link>
            <br />
            <br />

            <div>Find Friends</div>
            <FindFriends />
            <br />

            <div style={{ fontWeight: 'bold' }}>Friends</div>
            {friends && friends.map((friend, index) =>
                <div key={index} style={{ marginTop: '10px'}}>
                    <img src={friend.photoURL} alt='' style={{display: 'inline-block', height:'3em'}}></img>
                    <div style={{fontSize:'1.3em', display: 'inline-block'}}>{friend.name}</div>
                    <FriendsMovies friend={friend} />
                </div>
            )}

        </div>
    );
}

function FriendsMovies({ friend }) {
    const acceptedRef = firestore.collection('users').doc(friend.uid).collection('accepted');
    const query = acceptedRef.orderBy('createdAt', 'desc'); 

    const [movies] = useCollectionData(query);

    return (
        <div style={{marginTop: '20px', overflowX:'scroll', width:'100%', height:'8em', display: 'flex', flexDirection:'row', flexWrap:'nowrap'}}>
            {movies && movies.map((movie, index) => 
                <img src={movie.Poster} alt='' style={{height:'6em', marginRight:'20px', justifyContent:'center'}} key={index}></img>
            )}
        </div>
    );
}

function FindFriends() {
    const lastChar = (str) => {
        let chr = str.charAt(str.length - 1);
        let newChr = String.fromCharCode(chr.charCodeAt(0) + 1);
        return str.substring(0, str.length - 1) + newChr;
    }

    const usersRef = firestore.collection('users');
    const friendsRef = usersRef.doc(auth.currentUser.uid).collection('friends');

    const [formValue, setFormValue] = useState('');
    const [queryResult, setQueryResult] = useState([]);

    const format = (str) => {
        return str.toLowerCase().replace(/\s+/g, '');
    }

    const searchUsers = async (e) => {
        e.preventDefault();

        setQueryResult([]);
        document.getElementById('noresults').innerHTML = '';

        const querySnapshot = await usersRef.where('username', '>=', format(formValue)).where('username', '<', lastChar(format(formValue))).get();
        if (querySnapshot.empty) {
            document.getElementById('noresults').innerHTML = 'There are no users whose names start with that string';
        }
        querySnapshot.forEach(doc => {
            setQueryResult(queryResult => [...queryResult, doc.data()]);
        });
        
        setFormValue('');
    }

    const addFriend = async (user) => {
        await friendsRef.doc(user.uid).set({
            name: user.name,
            photoURL: user.photoURL,
            uid: user.uid,
        })
    }

    return (
        <div>
            <form onSubmit={searchUsers}>
                <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="find a friend..." />
                <button type="submit" disabled={!formValue}>Search</button>
            </form>

            <div>
                {queryResult.map((user, index) =>
                    user.uid !== auth.currentUser.uid ?
                        <div key={index} onClick={() => addFriend(user)} >
                            ➕
                            <img src={user.photoURL} alt='' style={{display: 'inline-block', height:'3em'}}></img>
                            <div style={{ color: 'blue' ,fontSize:'1.3em', display: 'inline-block'}} >
                                {user.name}
                            </div>
                        </div>
                        :
                        <div key={index} > {user.name} </div>
                )}
            </div>

            <div id="noresults"></div>

        </div>
    );
}

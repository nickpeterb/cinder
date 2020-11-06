import { useState } from 'react';
import { auth, firestore } from '../firebaseInitApp.js';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import './styles/Friends.css'

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
            <FindFriends />
            
            {friends && friends.map((friend, index) =>
                <div key={index} className='friend'>
                    <img src={friend.photoURL} alt='' className='friend-img'></img>
                    <div className='friend-name'>{friend.name}</div>
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
        <div className='friends-movies'>
            {movies && movies.map((movie, index) => 
                <img src={movie.Poster} alt='' className='friends-movies-poster' key={index}></img>
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
        <div className='search'>
            <form className="search-form" onSubmit={searchUsers}>
                <input className="search-box" value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Find a friend" />
                <button className="search-btn" type="submit" disabled={!formValue}>Search</button>
            </form>

            <div>
                {queryResult.map((user, index) =>
                    user.uid !== auth.currentUser.uid ?
                        <div key={index} onClick={() => addFriend(user)} className='search-result'>
                            <img src={user.photoURL} alt='' className='search-result-img'></img>
                            <div className='search-result-name'>{user.name}</div>
                        </div>
                        :
                        <div className='search-result'>
                            <img src={user.photoURL} alt='' className='search-result-img'></img>
                            <div key={index} className="search-result-name current-user"> {user.name} </div>
                        </div>
                )}
            </div>

            <div id="noresults"></div>

        </div>
    );
}

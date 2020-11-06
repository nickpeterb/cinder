import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import { auth, firestore } from '../firebaseInitApp.js';
import Movie from './Movie.js';

import './styles/Selector.css';

import imdbIds from '../imdbIds.js';
let ids = imdbIds;

export default function Selector() {

    const [movieId, setMovieId] = useState('');
    const [movie, setMovie] = useState();

    const getNewMovie = () => {
        let randIndex = Math.floor(Math.random() * Math.floor(ids.length));
        let randMovie = ids[randIndex];
        ids.splice(randIndex, 1);
        setMovieId(randMovie);
    }

    const acceptMovie = async () => {
        await firestore.collection('users').doc(auth.currentUser.uid).collection('accepted')
            .doc(movieId).set({
            imdbID: movieId,
            Title: movie.Title,
            Poster: movie.Poster,
            Plot: movie.Plot,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        })
            .then(
                getNewMovie()
            )
    }

    const rejectMovie = async () => {
        await firestore.collection('users').doc(auth.currentUser.uid).collection('rejected')
            .doc(movieId).set({
            imdbID: movieId,
            Title: movie.Title,
            Poster: movie.Poster,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        })
            .then(
                getNewMovie()
            )
    }

    useEffect(() => {
        getNewMovie()
    }, []);

    return (
        <>
            
            {/*<div>Hi, {auth.currentUser && auth.currentUser.displayName}</div>*/}

            <Movie id={movieId} hoistData={movie => setMovie(movie)}/>

            <div className="control-btns">
                <button className="reject-btn" onClick={rejectMovie}>👎</button>
                <button className="accept-btn" onClick={acceptMovie}>👍</button>
            </div>
        </>
    );
}
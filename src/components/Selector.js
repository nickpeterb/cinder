import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import { auth, firestore } from '../firebaseInitApp.js';
import Movie from './Movie.js';
import {SignOut} from './SignInOut.js';

import { Link } from "react-router-dom";

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
            <div>Hi, {auth.currentUser && auth.currentUser.displayName}</div>
            <br />
            <Link to="/mymovies" style={{marginRight:'20px'}}>My Movies</Link>
            <Link to="/friends" style={{marginRight:'20px'}}>Friends</Link>
            <SignOut />
            <br />
            <Movie id={movieId} hoistData={movie => setMovie(movie)}/>
            <br />
            <button onClick={rejectMovie}>Reject</button>
            <button onClick={acceptMovie}>Accept</button>
        </>
    );
}
import { useState, useEffect } from 'react';
import axios from 'axios';
import imdbCodes from './imdb-codes.js';
import './App.css';

let codes = imdbCodes;

//will be imported/exported from db
//but in another part of the application
//this file only needs to write to the db (accepted & rejected)
//might have to run some kind of function that checks on each accept whether it overlaps with anohter user's accepts
//unless i can periodically run a check in the background (firebase functions)
let accepted = [];
let rejected = [];

function Movie({id}) {
  const [movie, setMovie] = useState('');

  useEffect(() => {
    axios.get('http://www.omdbapi.com/?apikey=80b79dae&', {
      params: {
        i: id
      }
    })
    .then(response => {
      setMovie(response.data);
    })
  }, [movie, id]);

  return (
    <>
    <h1>{movie.Title}</h1>
    <img src={movie.Poster} alt=''></img>
    </>
  );
}

function Selector() {
  const [movieId, setMovieId] = useState('');

  const getNewMovie = () => {
    let randIndex = Math.floor(Math.random() * Math.floor(codes.length));
    let randMovie = codes[randIndex];
    codes.splice(randIndex, 1);
    setMovieId(randMovie);
    console.log(codes.length);
  }

  const acceptMovie = () => {
    accepted.push(movieId); //this will push to db instead
    getNewMovie();
  }

  const rejectMovie = () => {
    rejected.push(movieId); //this will push to db instead
    getNewMovie();
  }

  useEffect(() => {
    getNewMovie()
  }, []);

  return (
    <>
    <Movie id={movieId} />
    <br />
    <button onClick={acceptMovie}>Reject</button>
    <button onClick={rejectMovie}>Accept</button>
    </>
  );
}

function App() {

  return (
    <div className="App">
      <Selector />
    </div>
  );
}

export default App;
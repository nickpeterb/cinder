import { auth, firestore } from '../firebaseInitApp.js';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import './styles/MyMovies.css';

export default function MyMovies() {

    const acceptedRef = firestore.collection('users').doc(auth.currentUser.uid).collection('accepted');
    const query = acceptedRef.orderBy('createdAt', 'desc'); 

    // also can make a page with rejected movies with a button add them to accepted

    const [movies, loading, error] = useCollectionData(query);

    if(loading) {
        return(
            <div>Loading...</div>
        )
    }
    if(error) console.log('error: ' + error);

    return (
        <div className='mymovies'>

        {movies.length === 0 && <div>There are no movies in your list.</div>}
        
        {movies && movies.map(movie => 
            <MovieCard key={movie.imdbID} movie={movie}/>
        )}
        </div>
    );
}

function MovieCard({movie}) {
    console.log(movie);
    return (
        <div className='movie-card'>
            <img className='movie-card-poster' src={movie.Poster} alt=''></img>
            <div clasName='movie-card-body'>
                <div className='movie-card-title'>{movie.Title}</div>
                <div className='movie-card-plot'>{movie.Plot}</div>
            </div>
        </div>
    );
}
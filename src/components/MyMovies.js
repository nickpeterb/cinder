import { auth, firestore } from '../firebaseInitApp.js';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import { Link } from 'react-router-dom';

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
        <>
        <Link to='/selector'>Home</Link>
        
        <div style={{padding:'20px'}}>My Movies</div>

        {movies.length === 0 && <div>There are no movies in your list.</div>}
        
        {movies && movies.map(movie => 
            <MovieCard key={movie.imdbID} movie={movie}/>
        )}
        </>
    );
}

function MovieCard({movie}) {
    return (
        <div style={{display:'flex', flexDirection:'row', marginBottom:'20px'}}>
            <img style={{height:'6em'}} src={movie.Poster} alt=''></img>
            <div style={{fontSize:'2.5em'}}>{movie.Title}</div>
        </div>
    );
}
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Movie({ id, hoistData }) {
    const [movie, setMovie] = useState('');

    useEffect(() => {
        let source = axios.CancelToken.source();

        const loadData = async () => {
            try {
                const response = await axios.get('https://www.omdbapi.com/?apikey=80b79dae&', {
                    cancelToken: source.token,
                    params: { i: id }
                });
                //console.log("AxiosCancel: got response");
                setMovie(response.data);
                hoistData(response.data);
            } catch (error) {
                if (axios.isCancel(error)) {
                    //console.log("AxiosCancel: caught cancel");
                } else {
                    throw error;
                }
            }
        };
        loadData();

        return () => {
            //console.log("AxiosCancel: unmounting");
            source.cancel();
        };
    }, [id, hoistData]);

    return (
        <>
            <h1>{movie.Title}</h1>
            <img src={movie.Poster} alt=''></img>
        </>
    );
}
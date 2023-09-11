'use client';

import { Movie, MovieInput } from '@/shared/types';
import './globals.css';
import { useState } from 'react';
import MoviesList from '@/app/components/MoviesList/MoviesList';

const Home = (): JSX.Element => {
  const [movies, setMovies] = useState<Movie[]>([]);

  function fetchMoviesHandler() {
    fetch('https://swapi.dev/api/films')
      .then((response) => { return response.json() })
      .then((data) => {
        const transformedMovies = data.results.map((movieData: MovieInput) => {
          return {
            id: movieData.id,
            title: movieData.title,
            openingText: movieData.opening_crawl,
            releaseDate: movieData.release_date
          }
        })
      setMovies(transformedMovies);
    });
  }

  return (
    <>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        <MoviesList movies={movies} />
      </section>
    </>
  )
}

export default Home;
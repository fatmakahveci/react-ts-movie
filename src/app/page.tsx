'use client';

import MoviesList from '@/app/components/MoviesList/MoviesList';
import { Movie, MovieInput } from '@/shared/types';
import { useState } from 'react';
import './globals.css';

const Home = (): JSX.Element => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function fetchMoviesHandler() {
    setIsLoading(true);
    const response = await fetch('https://swapi.dev/api/films');
    const data = await response.json();

    const transformedMovies = data.results.map((movieData: MovieInput) => {
      return {
        id: movieData.id,
        title: movieData.title,
        openingText: movieData.opening_crawl,
        releaseDate: movieData.release_date
      }
    })
    setMovies(transformedMovies);
    setIsLoading(false);
  }

  return (
    <>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && <p>Found no movies...</p>}
        {isLoading && <p>Loading...</p>}
      </section>
    </>
  )
}

export default Home;
'use client';

import MovieCard from '@/app/components/Movies/Movies';
import type { MoviesListProps } from '@/shared/types';
import './MoviesList.css';

const MoviesList = ({ movies }: MoviesListProps): JSX.Element => (
  <ul className="moviesGrid" aria-label="Saved movies">
    {movies.map((movie) => (
      <MovieCard key={movie.id} {...movie} />
    ))}
  </ul>
);

export default MoviesList;

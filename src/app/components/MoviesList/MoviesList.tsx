'use client';

import Movies from '@/app/components/Movies/Movies';
import { Movie, MoviesListProps } from "@/shared/types";
import { FC } from "react";

const MoviesList: FC<MoviesListProps> = ({ movies }): JSX.Element => {
  return (
    <ul className="movies-list">
        {movies.map((movie: Movie) => (
            <Movies
                title={movie.title}
                releaseDate={movie.releaseDate}
                openingText={movie.openingText}
            />
        ))}
    </ul>
  )
}
export default MoviesList;
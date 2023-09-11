'use client';

import { Movie } from '@/shared/types';
import { FC } from "react";

const Movie: FC<Movie> = ({ title, releaseDate, openingText}) => {
  return (
    <li className="movie">
        <h2>{title}</h2>
        <h3>{releaseDate}</h3>
        <p>{openingText}</p>
    </li>
  )
}
export default Movie;
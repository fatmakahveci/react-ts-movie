'use client';

import type { Movie } from '@/shared/types';
import './Movies.css';

const MovieCard = ({ title, releaseDate, openingText }: Movie): JSX.Element => {
  const initials = title
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  return (
    <li className="movieCard">
      <article>
        <div className="movieMonogram" aria-hidden="true">{initials}</div>
        <div className="movieBody">
          <div className="movieMeta">
            <h3>{title}</h3>
            <time dateTime={releaseDate}>
              {new Intl.DateTimeFormat('en', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                timeZone: 'UTC',
              }).format(new Date(`${releaseDate}T00:00:00Z`))}
            </time>
          </div>
          <p>{openingText}</p>
        </div>
      </article>
    </li>
  );
};

export default MovieCard;

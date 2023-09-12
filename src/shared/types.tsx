'use client';

export type AddMovieProps = {
    onAddMovie: (movie: Movie) => void;
};

export type Movie = {
    id?:  string;
    title: string;
    openingText: string;
    releaseDate: string;
};

export type MovieInput = {
    id: string,
    title: string,
    opening_crawl: string,
    release_date: string
}

export type MoviesListProps = {
    movies: Movie[];
};
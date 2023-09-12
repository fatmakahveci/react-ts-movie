'use client';

import { AddMovieProps, Movie } from '@/shared/types';
import { FC, FormEvent, useRef } from 'react';
import './AddMovie.css';

const AddMovie: FC<AddMovieProps> = ({ onAddMovie }): JSX.Element => {
    const titleRef = useRef<HTMLInputElement>(null);
    const openingTextRef = useRef<HTMLTextAreaElement>(null);
    const releaseDateRef = useRef<HTMLInputElement>(null);

    function submitHandler(e: FormEvent<HTMLFormElement>): void {
        e.preventDefault();
        if (!titleRef.current || !openingTextRef.current || !releaseDateRef.current) return;
        
        const movie: Movie = {
            title: titleRef.current.value,
            openingText: openingTextRef.current.value,
            releaseDate: releaseDateRef.current.value,
        };

        onAddMovie(movie);
    }

    return (
        <form onSubmit={submitHandler}>
            <div className="control">
                <label htmlFor='title'>Title</label>
                <input type='text' id='title' ref={titleRef} />
            </div>
            <div className="control">
                <label htmlFor='opening-text'>Opening Text</label>
                <textarea rows={+'5'} id='opening-text' ref={openingTextRef}></textarea>
            </div>
            <div className="control">
                <label htmlFor='date'>Release Date</label>
                <input type='text' id='date' ref={releaseDateRef} />
            </div>
            <button>Add Movie</button>
        </form>
    )
};
export default AddMovie;
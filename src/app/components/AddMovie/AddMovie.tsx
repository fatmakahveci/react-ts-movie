'use client';

import { normalizeMovieDraft, validateMovie } from '@/lib/movie-validation';
import type { AddMovieProps, MovieDraft } from '@/shared/types';
import { type ChangeEvent, type FormEvent, useState } from 'react';
import './AddMovie.css';

const EMPTY_MOVIE: MovieDraft = {
  title: '',
  openingText: '',
  releaseDate: '',
};

type TouchedFields = Partial<Record<keyof MovieDraft, boolean>>;

const AddMovie = ({ isSubmitting, onAddMovie }: AddMovieProps): JSX.Element => {
  const [movie, setMovie] = useState<MovieDraft>(EMPTY_MOVIE);
  const [touched, setTouched] = useState<TouchedFields>({});
  const errors = validateMovie(movie);

  const updateField = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const field = event.target.name as keyof MovieDraft;
    setMovie((currentMovie) => ({
      ...currentMovie,
      [field]: event.target.value,
    }));
  };

  const touchField = (field: keyof MovieDraft): void => {
    setTouched((currentTouched) => ({ ...currentTouched, [field]: true }));
  };

  const submitMovie = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const allTouched: TouchedFields = {
      title: true,
      openingText: true,
      releaseDate: true,
    };
    setTouched(allTouched);

    if (Object.keys(errors).length > 0 || isSubmitting) {
      return;
    }

    const wasAdded = await onAddMovie(normalizeMovieDraft(movie));
    if (wasAdded) {
      setMovie(EMPTY_MOVIE);
      setTouched({});
    }
  };

  return (
    <form className="movieForm" onSubmit={submitMovie} noValidate>
      <div className="fieldGroup">
        <label htmlFor="movie-title">Title</label>
        <input
          id="movie-title"
          name="title"
          type="text"
          value={movie.title}
          onChange={updateField}
          onBlur={() => touchField('title')}
          maxLength={100}
          placeholder="e.g. Arrival"
          autoComplete="off"
          aria-invalid={Boolean(touched.title && errors.title)}
          aria-describedby={touched.title && errors.title ? 'movie-title-error' : undefined}
        />
        {touched.title && errors.title && (
          <p className="fieldError" id="movie-title-error">{errors.title}</p>
        )}
      </div>

      <div className="fieldGroup">
        <div className="labelRow">
          <label htmlFor="movie-description">Opening text</label>
          <span>{movie.openingText.length}/600</span>
        </div>
        <textarea
          id="movie-description"
          name="openingText"
          value={movie.openingText}
          onChange={updateField}
          onBlur={() => touchField('openingText')}
          maxLength={600}
          rows={5}
          placeholder="What makes this movie memorable?"
          aria-invalid={Boolean(touched.openingText && errors.openingText)}
          aria-describedby={
            touched.openingText && errors.openingText
              ? 'movie-description-error'
              : undefined
          }
        />
        {touched.openingText && errors.openingText && (
          <p className="fieldError" id="movie-description-error">{errors.openingText}</p>
        )}
      </div>

      <div className="formFooter">
        <div className="fieldGroup">
          <label htmlFor="movie-release-date">Release date</label>
          <input
            id="movie-release-date"
            name="releaseDate"
            type="date"
            value={movie.releaseDate}
            onChange={updateField}
            onBlur={() => touchField('releaseDate')}
            aria-invalid={Boolean(touched.releaseDate && errors.releaseDate)}
            aria-describedby={
              touched.releaseDate && errors.releaseDate
                ? 'movie-release-date-error'
                : undefined
            }
          />
          {touched.releaseDate && errors.releaseDate && (
            <p className="fieldError" id="movie-release-date-error">{errors.releaseDate}</p>
          )}
        </div>

        <button className="primaryButton" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="buttonSpinner" aria-hidden="true" />
              Adding movie…
            </>
          ) : (
            <>
              <span aria-hidden="true">＋</span>
              Add movie
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AddMovie;

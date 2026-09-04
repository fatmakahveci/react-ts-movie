import type { MovieDraft, MovieValidationErrors } from '@/shared/types';

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const normalizeMovieDraft = (movie: MovieDraft): MovieDraft => ({
  title: movie.title.trim(),
  openingText: movie.openingText.trim(),
  releaseDate: movie.releaseDate.trim(),
});

const isValidIsoDate = (value: string): boolean => {
  if (!ISO_DATE_PATTERN.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().startsWith(value);
};

export const validateMovie = (movie: MovieDraft): MovieValidationErrors => {
  const normalized = normalizeMovieDraft(movie);
  const errors: MovieValidationErrors = {};

  if (!normalized.title) {
    errors.title = 'Enter a movie title.';
  } else if (normalized.title.length > 100) {
    errors.title = 'Keep the title under 100 characters.';
  }

  if (!normalized.openingText) {
    errors.openingText = 'Add a short movie description.';
  } else if (normalized.openingText.length > 600) {
    errors.openingText = 'Keep the description under 600 characters.';
  }

  if (!normalized.releaseDate) {
    errors.releaseDate = 'Choose a release date.';
  } else if (!isValidIsoDate(normalized.releaseDate)) {
    errors.releaseDate = 'Use a valid calendar date.';
  }

  return errors;
};

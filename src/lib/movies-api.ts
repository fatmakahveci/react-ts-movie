import type { Movie, MovieDraft } from '@/shared/types';

type RequestOptions = {
  databaseUrl?: string;
  fetcher?: typeof fetch;
  signal?: AbortSignal;
};

type FirebaseMovieRecord = {
  title: string;
  openingText: string;
  releaseDate: string;
};

const MOVIES_RESOURCE = 'movies.json';

export class MovieApiError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'MovieApiError';
  }
}

export const buildMoviesEndpoint = (
  databaseUrl = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
): string => {
  const configuredUrl = databaseUrl?.trim();

  if (!configuredUrl) {
    throw new MovieApiError(
      'Movie database is not configured. Add NEXT_PUBLIC_FIREBASE_DATABASE_URL to .env.local.',
    );
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(configuredUrl);
  } catch (error) {
    throw new MovieApiError('The configured movie database URL is invalid.', {
      cause: error,
    });
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    throw new MovieApiError('The movie database URL must use HTTP or HTTPS.');
  }

  parsedUrl.pathname = `${parsedUrl.pathname.replace(/\/+$/, '')}/${MOVIES_RESOURCE}`;
  parsedUrl.search = '';
  parsedUrl.hash = '';
  return parsedUrl.toString();
};

const isFirebaseMovieRecord = (value: unknown): value is FirebaseMovieRecord => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.title === 'string'
    && typeof candidate.openingText === 'string'
    && typeof candidate.releaseDate === 'string'
  );
};

export const parseMovieCollection = (payload: unknown): Movie[] => {
  if (payload === null) {
    return [];
  }

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new MovieApiError('The movie database returned an unexpected response.');
  }

  return Object.entries(payload)
    .filter((entry): entry is [string, FirebaseMovieRecord] => isFirebaseMovieRecord(entry[1]))
    .map(([id, movie]) => ({
      id,
      title: movie.title.trim(),
      openingText: movie.openingText.trim(),
      releaseDate: movie.releaseDate,
    }))
    .sort((first, second) => second.releaseDate.localeCompare(first.releaseDate));
};

const responseError = (action: string, response: Response): MovieApiError =>
  new MovieApiError(
    `Unable to ${action} movies (HTTP ${response.status}). Please try again.`,
  );

export const getMovies = async (options: RequestOptions = {}): Promise<Movie[]> => {
  const fetcher = options.fetcher ?? fetch;
  const response = await fetcher(buildMoviesEndpoint(options.databaseUrl), {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal: options.signal,
  });

  if (!response.ok) {
    throw responseError('load', response);
  }

  try {
    return parseMovieCollection(await response.json());
  } catch (error) {
    if (error instanceof MovieApiError) {
      throw error;
    }
    throw new MovieApiError('The movie database returned invalid JSON.', {
      cause: error,
    });
  }
};

export const createMovie = async (
  movie: MovieDraft,
  options: RequestOptions = {},
): Promise<void> => {
  const fetcher = options.fetcher ?? fetch;
  const response = await fetcher(buildMoviesEndpoint(options.databaseUrl), {
    method: 'POST',
    body: JSON.stringify(movie),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    signal: options.signal,
  });

  if (!response.ok) {
    throw responseError('save', response);
  }
};

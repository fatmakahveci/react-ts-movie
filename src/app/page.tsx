'use client';

import AddMovie from '@/app/components/AddMovie/AddMovie';
import MoviesList from '@/app/components/MoviesList/MoviesList';
import { createMovie, getMovies } from '@/lib/movies-api';
import type { Movie, MovieDraft } from '@/shared/types';
import { useCallback, useEffect, useState } from 'react';

type Feedback = {
  message: string;
  tone: 'success' | 'warning';
};

const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.';

const Home = (): JSX.Element => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const fetchMovies = useCallback(async (
    signal?: AbortSignal,
    successMessage?: string,
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const loadedMovies = await getMovies({ signal });
      setMovies(loadedMovies);
      if (successMessage) {
        setFeedback({ message: successMessage, tone: 'success' });
      }
      return true;
    } catch (requestError) {
      if (signal?.aborted) {
        return false;
      }
      setError(errorMessage(requestError));
      return false;
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const loadInitialMovies = async (): Promise<void> => {
      try {
        const loadedMovies = await getMovies({ signal: controller.signal });
        setMovies(loadedMovies);
      } catch (requestError) {
        if (!controller.signal.aborted) {
          setError(errorMessage(requestError));
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadInitialMovies();
    return () => controller.abort();
  }, []);

  const addMovie = async (movie: MovieDraft): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);
    setFeedback(null);

    try {
      await createMovie(movie);
      const refreshed = await fetchMovies(
        undefined,
        `“${movie.title}” was added to your library.`,
      );

      if (!refreshed) {
        setFeedback({
          message: 'The movie was saved, but the library could not be refreshed.',
          tone: 'warning',
        });
      }
      return true;
    } catch (requestError) {
      setError(errorMessage(requestError));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const movieCountLabel = `${movies.length} ${movies.length === 1 ? 'movie' : 'movies'}`;

  return (
    <main className="appShell">
      <header className="hero">
        <div>
          <p className="eyebrow">Your personal watchlist</p>
          <h1>React Movie Library</h1>
          <p className="heroCopy">
            Keep memorable films, release dates, and the stories that made them stand out.
          </p>
        </div>
        <div className="libraryStat" aria-label={movieCountLabel}>
          <strong>{movies.length}</strong>
          <span>{movies.length === 1 ? 'movie saved' : 'movies saved'}</span>
        </div>
      </header>

      <div className="contentGrid">
        <section className="panel composerPanel" aria-labelledby="add-movie-heading">
          <div className="sectionHeading">
            <div>
              <p className="sectionKicker">New entry</p>
              <h2 id="add-movie-heading">Add a movie</h2>
            </div>
            <span className="stepBadge">01</span>
          </div>
          <AddMovie isSubmitting={isSubmitting} onAddMovie={addMovie} />
        </section>

        <section className="panel libraryPanel" aria-labelledby="movie-library-heading">
          <div className="sectionHeading libraryHeading">
            <div>
              <p className="sectionKicker">Collection</p>
              <h2 id="movie-library-heading">Movie library</h2>
            </div>
            <button
              className="secondaryButton"
              type="button"
              onClick={() => {
                setFeedback(null);
                void fetchMovies(undefined, 'Your movie library is up to date.');
              }}
              disabled={isLoading || isSubmitting}
            >
              <span aria-hidden="true">↻</span>
              {isLoading ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>

          <div className="announcements" aria-live="polite" aria-atomic="true">
            {feedback && (
              <p className={`notice notice--${feedback.tone}`}>{feedback.message}</p>
            )}
            {error && (
              <div className="notice notice--error" role="alert">
                <span>{error}</span>
                <button type="button" onClick={() => void fetchMovies()}>
                  Try again
                </button>
              </div>
            )}
          </div>

          {isLoading && movies.length === 0 ? (
            <div className="movieSkeletons" aria-label="Loading movies" aria-busy="true">
              <span />
              <span />
              <span />
            </div>
          ) : movies.length > 0 ? (
            <MoviesList movies={movies} />
          ) : !error ? (
            <div className="emptyState">
              <span className="emptyStateIcon" aria-hidden="true">▶</span>
              <h3>Your library is ready</h3>
              <p>Add the first movie to start building your collection.</p>
            </div>
          ) : null}
        </section>
      </div>

      <footer>
        <span>Built with Next.js and TypeScript</span>
        <span aria-hidden="true">•</span>
        <span>Powered by Firebase</span>
      </footer>
    </main>
  );
};

export default Home;

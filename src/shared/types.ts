export type MovieDraft = {
  title: string;
  openingText: string;
  releaseDate: string;
};

export type Movie = MovieDraft & {
  id: string;
};

export type MovieValidationErrors = Partial<Record<keyof MovieDraft, string>>;

export type AddMovieProps = {
  isSubmitting: boolean;
  onAddMovie: (movie: MovieDraft) => Promise<boolean>;
};

export type MoviesListProps = {
  movies: Movie[];
};

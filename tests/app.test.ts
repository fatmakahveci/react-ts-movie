import assert from 'node:assert/strict';
import test from 'node:test';
import {
  MovieApiError,
  buildMoviesEndpoint,
  parseMovieCollection,
  createMovie,
  getMovies,
} from '../src/lib/movies-api';
import { normalizeMovieDraft, validateMovie } from '../src/lib/movie-validation';

test('buildMoviesEndpoint validates configuration and appends the collection path', () => {
  assert.equal(
    buildMoviesEndpoint('https://example-default-rtdb.firebaseio.com/'),
    'https://example-default-rtdb.firebaseio.com/movies.json',
  );
  assert.throws(() => buildMoviesEndpoint(''), MovieApiError);
  assert.throws(() => buildMoviesEndpoint('file:///tmp/database'), /HTTP or HTTPS/);
});

test('parseMovieCollection handles empty data, skips malformed records, and sorts by date', () => {
  assert.deepEqual(parseMovieCollection(null), []);

  assert.deepEqual(
    parseMovieCollection({
      older: {
        title: '  Inception  ',
        openingText: '  Dream-sharing technology.  ',
        releaseDate: '2010-07-16',
      },
      invalid: { title: 'Missing fields' },
      newer: {
        title: 'Arrival',
        openingText: 'Visitors from beyond Earth.',
        releaseDate: '2016-11-11',
      },
    }),
    [
      {
        id: 'newer',
        title: 'Arrival',
        openingText: 'Visitors from beyond Earth.',
        releaseDate: '2016-11-11',
      },
      {
        id: 'older',
        title: 'Inception',
        openingText: 'Dream-sharing technology.',
        releaseDate: '2010-07-16',
      },
    ],
  );

  assert.throws(() => parseMovieCollection([]), /unexpected response/);
});

test('getMovies performs a typed GET request and parses the response', async () => {
  const fetcher = (async (input: RequestInfo | URL, init?: RequestInit) => {
    assert.equal(String(input), 'https://movies.example/movies.json');
    assert.equal(init?.method, 'GET');
    assert.equal((init?.headers as Record<string, string>).Accept, 'application/json');
    return new Response(JSON.stringify({
      movie: {
        title: 'Arrival',
        openingText: 'First contact.',
        releaseDate: '2016-11-11',
      },
    }), { headers: { 'Content-Type': 'application/json' } });
  }) as typeof fetch;

  const movies = await getMovies({
    databaseUrl: 'https://movies.example',
    fetcher,
  });

  assert.equal(movies[0]?.id, 'movie');
  assert.equal(movies[0]?.title, 'Arrival');
});

test('createMovie sends normalized JSON and reports HTTP failures', async () => {
  const movie = {
    title: 'Arrival',
    openingText: 'First contact.',
    releaseDate: '2016-11-11',
  };

  const successfulFetcher = (async (input: RequestInfo | URL, init?: RequestInit) => {
    assert.equal(String(input), 'https://movies.example/movies.json');
    assert.equal(init?.method, 'POST');
    assert.equal(init?.body, JSON.stringify(movie));
    assert.equal(
      (init?.headers as Record<string, string>)['Content-Type'],
      'application/json',
    );
    return new Response(JSON.stringify({ name: 'generated-id' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }) as typeof fetch;

  await createMovie(movie, {
    databaseUrl: 'https://movies.example',
    fetcher: successfulFetcher,
  });

  const failingFetcher = (async () =>
    new Response(null, { status: 503 })) as typeof fetch;

  await assert.rejects(
    createMovie(movie, {
      databaseUrl: 'https://movies.example',
      fetcher: failingFetcher,
    }),
    /HTTP 503/,
  );
});

test('movie validation trims values and returns field-specific errors', () => {
  assert.deepEqual(
    normalizeMovieDraft({
      title: '  Arrival ',
      openingText: ' First contact.  ',
      releaseDate: ' 2016-11-11 ',
    }),
    {
      title: 'Arrival',
      openingText: 'First contact.',
      releaseDate: '2016-11-11',
    },
  );

  assert.deepEqual(
    validateMovie({ title: '', openingText: '', releaseDate: '2024-02-30' }),
    {
      title: 'Enter a movie title.',
      openingText: 'Add a short movie description.',
      releaseDate: 'Use a valid calendar date.',
    },
  );
  assert.deepEqual(
    validateMovie({
      title: 'Arrival',
      openingText: 'First contact.',
      releaseDate: '2016-11-11',
    }),
    {},
  );
});

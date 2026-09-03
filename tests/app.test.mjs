import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the movie page handles loading, failure, and successful results", async () => {
  const page = await readFile("src/app/page.tsx", "utf8");

  assert.match(page, /setIsLoading\(true\)/);
  assert.match(page, /if \(!response\.ok\)/);
  assert.match(page, /setMovies\(loadedMovies\)/);
  assert.match(page, /<MoviesList movies=\{movies\}/);
});

test("new movies are sent as JSON", async () => {
  const page = await readFile("src/app/page.tsx", "utf8");

  assert.match(page, /method: 'POST'/);
  assert.match(page, /JSON\.stringify\(movie\)/);
  assert.match(page, /'Content-Type': 'application\/json'/);
});

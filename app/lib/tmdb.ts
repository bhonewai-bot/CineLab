/**
 * Direct TMDB helpers for server-side use (SSR / SSG).
 *
 * Server components and pages call these functions instead of fetching
 * through internal /api/* route handlers. Self-referencing fetches break
 * at build time on Vercel because no server is running yet.
 *
 * The /api/* routes remain available for any client-side fetching.
 */

const TMDB_BASE = "https://api.themoviedb.org/3";

function tmdbHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
  };
}

async function tmdbFetch<T>(path: string, revalidate = 3600): Promise<T> {
  const res = await fetch(`${TMDB_BASE}${path}`, {
    headers: tmdbHeaders(),
    next: { revalidate },
  });
  if (!res.ok) throw new Error(`TMDB fetch failed: ${path} (${res.status})`);
  return res.json();
}

export async function getPopularMovies() {
  const data = await tmdbFetch<{ results: [] }>(
    "/movie/popular?language=en-US&page=1"
  );
  return data.results ?? [];
}

export async function getTrendingMovies() {
  const data = await tmdbFetch<{ results: [] }>(
    "/trending/movie/week?language=en-US"
  );
  return data.results ?? [];
}

export async function getNowPlayingMovies() {
  const data = await tmdbFetch<{ results: [] }>(
    "/movie/now_playing?language=en-US&page=1"
  );
  return data.results ?? [];
}

export async function getGenres() {
  const data = await tmdbFetch<{ genres: [] }>(
    "/genre/movie/list?language=en-US",
    86400 // genres rarely change — cache for 24h
  );
  return data.genres ?? [];
}

export async function getMoviesByGenre(genreId: number) {
  const data = await tmdbFetch<{ results: [] }>(
    `/discover/movie?with_genres=${genreId}&language=en-US&page=1&sort_by=popularity.desc`
  );
  return data.results ?? [];
}

export async function getMovieDetail(id: string) {
  const data = await tmdbFetch<object>(
    `/movie/${id}?language=en-US&append_to_response=credits,videos,similar`
  );
  return data;
}

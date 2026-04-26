/**
 * Internal API helpers — call our own Route Handlers instead of TMDB directly.
 * Using internal routes keeps all TMDB auth server-side and centralizes caching.
 */

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

async function fetchInternal<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Internal fetch failed: ${path}`);
  return res.json();
}

export async function getPopularMovies() {
  const data = await fetchInternal<{ results: [] }>("/api/movies?type=popular");
  return data.results ?? [];
}

export async function getTrendingMovies() {
  const data = await fetchInternal<{ results: [] }>(
    "/api/movies?type=trending",
  );
  return data.results ?? [];
}

export async function getNowPlayingMovies() {
  const data = await fetchInternal<{ results: [] }>(
    "/api/movies?type=now_playing",
  );
  return data.results ?? [];
}

export async function getGenres() {
  const data = await fetchInternal<{ genres: [] }>("/api/genres");
  return data.genres ?? [];
}

export async function getMoviesByGenre(genreId: number) {
  const data = await fetchInternal<{ results: [] }>(
    `/api/genres?id=${genreId}`,
  );
  return data.results ?? [];
}

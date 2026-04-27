/**
 * Direct TMDB helpers for server-side use (SSR / SSG).
 *
 * Server components and pages call these functions instead of fetching
 * through internal /api/* route handlers. Self-referencing fetches break
 * at build time on Vercel because no server is running yet.
 *
 * The /api/* routes remain available for any client-side fetching.
 */

import { Genre, Movie, MovieDetail } from "./types";

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

export async function getPopularMovies(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>("/movie/popular");
  return data.results ?? [];
}

export async function getTrendingMovies(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>(
    "/trending/movie/week?language=en-US",
  );
  return data.results ?? [];
}

export async function getNowPlayingMovies(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>("/movie/now_playing");
  return data.results ?? [];
}

export async function getGenres(): Promise<Genre[]> {
  const data = await tmdbFetch<{ genres: Genre[] }>(
    "/genre/movie/list",
    86400, // genres rarely change — cache for 24h
  );
  return data.genres ?? [];
}

export async function getMoviesByGenre(genreId: number): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>(
    `/discover/movie?with_genres=${genreId}&language=en-US&page=1&sort_by=popularity.desc`,
  );
  return data.results ?? [];
}

export async function getMovieDetail(id: string): Promise<MovieDetail> {
  const data = await tmdbFetch<MovieDetail>(
    `/movie/${id}?language=en-US&append_to_response=credits,videos,similar`,
  );
  return data;
}

"use server";

import { Movie } from "@/lib/types";

type SearchResult = {
  results: Movie[];
  total_results: number;
};

export async function searchMovies(query: string): Promise<SearchResult> {
  const trimmed = query.trim();

  if (!trimmed) {
    return { results: [], total_results: 0 };
  }

  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(trimmed)}&language=en-US&page=1&include_adult=false`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      cache: "no-store", // search results always fresh
    },
  );

  if (!res.ok) {
    throw new Error(`TMDB search failed: ${res.status}`);
  }

  const data = await res.json();
  return {
    results: data.results ?? [],
    total_results: data.total_results ?? 0,
  };
}

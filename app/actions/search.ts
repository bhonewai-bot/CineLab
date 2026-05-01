"use server";

import { searchMovies } from "@/lib/tmdb";

export async function searchMoviesAction(query: string) {
  const trimmed = query.trim();

  if (!trimmed) {
    return { results: [], total_results: 0 };
  }

  return await searchMovies(trimmed);
}

import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://api.themoviedb.org/3";

/**
 * GET /api/search?query=inception
 *
 * Searches TMDB for movies matching the given query string.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query || query.trim() === "") {
    return NextResponse.json({ results: [], total_results: 0 });
  }

  const res = await fetch(
    `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=1&include_adult=false`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
      },
      next: { revalidate: 0 }, // search results should always be fresh
    },
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch from TMDB", results: [], total_results: 0 },
      { status: res.status },
    );
  }

  const data = await res.json();
  return NextResponse.json({
    results: data.results ?? [],
    total_results: data.total_results ?? 0,
  });
}

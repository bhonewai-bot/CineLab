import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://api.themoviedb.org/3";

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
  };
}

/**
 * GET /api/movies?type=popular|trending|now_playing
 *
 * Returns a list of movies based on the requested type.
 * - popular     → /movie/popular
 * - trending    → /trending/movie/week
 * - now_playing → /movie/now_playing
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  let endpoint: string;
  let revalidate: number;

  switch (type) {
    case "popular":
      endpoint = `${BASE_URL}/movie/popular?language=en-US&page=1`;
      revalidate = 3600;
      break;
    case "trending":
      endpoint = `${BASE_URL}/trending/movie/week?language=en-US`;
      revalidate = 3600;
      break;
    case "now_playing":
      endpoint = `${BASE_URL}/movie/now_playing?language=en-US&page=1`;
      revalidate = 3600;
      break;
    default:
      return NextResponse.json(
        { error: "Invalid or missing `type` param. Use: popular | trending | now_playing" },
        { status: 400 }
      );
  }

  const res = await fetch(endpoint, {
    headers: getHeaders(),
    next: { revalidate },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch from TMDB", results: [] },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json({
    results: data.results ?? [],
    total_results: data.total_results ?? 0,
  });
}

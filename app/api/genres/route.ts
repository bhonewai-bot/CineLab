import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://api.themoviedb.org/3";

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
  };
}

/**
 * GET /api/genres          → returns the full list of movie genres
 * GET /api/genres?id=28    → returns movies for the given genre ID
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const genreId = searchParams.get("id");

  // No id → return genre list
  if (!genreId) {
    const res = await fetch(`${BASE_URL}/genre/movie/list?language=en-US`, {
      headers: getHeaders(),
      next: { revalidate: 86400 }, // genres rarely change — cache for 24h
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch genres from TMDB", genres: [] },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json({ genres: data.genres ?? [] });
  }

  // id provided → return movies for that genre
  const id = parseInt(genreId, 10);
  if (isNaN(id)) {
    return NextResponse.json(
      { error: "Invalid genre `id`. Must be a number." },
      { status: 400 }
    );
  }

  const res = await fetch(
    `${BASE_URL}/discover/movie?with_genres=${id}&language=en-US&page=1&sort_by=popularity.desc`,
    {
      headers: getHeaders(),
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch movies for genre from TMDB", results: [] },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json({
    results: data.results ?? [],
    total_results: data.total_results ?? 0,
  });
}

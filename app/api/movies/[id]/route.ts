import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://api.themoviedb.org/3";

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
  };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid movie ID" }, { status: 400 });
  }

  const res = await fetch(
    `${BASE_URL}/movie/${id}?append_to_response=credits,videos,similar&language=en-US`,
    {
      headers: getHeaders(),
      next: { revalidate: 3600 },
    },
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Movie not found" },
      { status: res.status },
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}

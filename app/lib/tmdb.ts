const BASE_URL = "https://api.themoviedb.org/3";

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
  };
}

export async function getPopularMovies() {
  const res = await fetch(`${BASE_URL}/movie/popular?language=en-US&page=1`, {
    headers: getHeaders(),
    next: { revalidate: 3600 },
  });
  const data = await res.json();
  if (!res.ok) {
    return [];
  }
  return data.results ?? [];
}

export async function getTrendingMovies() {
  const res = await fetch(`${BASE_URL}/trending/movie/week?language=en-US`, {
    headers: getHeaders(),
    next: { revalidate: 3600 },
  });
  const data = await res.json();
  if (!res.ok) {
    return [];
  }
  return data.results ?? [];
}

export async function getNowPlayingMovies() {
  const res = await fetch(
    `${BASE_URL}/movie/now_playing?language=en-US&page=1`,
    {
      headers: getHeaders(),
      next: { revalidate: 3600 },
    },
  );
  const data = await res.json();
  if (!res.ok) {
    return [];
  }
  return data.results ?? [];
}

export async function getGenres() {
  const res = await fetch(`${BASE_URL}/genre/movie/list?language=en-US`, {
    headers: getHeaders(),
    next: { revalidate: 86400 },
  });
  const data = await res.json();
  if (!res.ok) {
    return [];
  }
  return data.genres ?? [];
}

export async function getMoviesByGenre(genreId: number) {
  const res = await fetch(
    `${BASE_URL}/discover/movie?with_genres=${genreId}&language=en-US&page=1&sort_by=popularity.desc`,
    {
      headers: getHeaders(),
      next: { revalidate: 3600 },
    },
  );
  const data = await res.json();
  if (!res.ok) {
    return [];
  }
  return data.results ?? [];
}

import {
  searchMovies,
  getMovieDetail,
  getSimilarMovies,
  getTrendingMovies,
  getMoviesByGenre,
} from "@/lib/tmdb";
import { formatRating, TMDB_IMAGE } from "../utils";

// Normalize movie data before returning to AI — keep it clean and small
function normalizeMovie(m: {
  id: number;
  title: string;
  release_date?: string;
  vote_average?: number;
  overview?: string;
  poster_path?: string;
}) {
  return {
    id: m.id,
    title: m.title,
    year: m.release_date?.slice(0, 4) ?? "Unknown",
    rating: formatRating(m.vote_average ?? 0),
    overview: m.overview ?? "",
    poster: m.poster_path ? `${TMDB_IMAGE}/w342${m.poster_path}` : null,
  };
}

export async function handleToolCall(
  name: string,
  args: Record<string, string>,
): Promise<unknown> {
  switch (name) {
    case "get_trending_movies": {
      const movies = await getTrendingMovies();
      return movies.slice(0, 7).map(normalizeMovie);
    }

    case "search_movies": {
      const data = await searchMovies(args.query);
      return data.results.slice(0, 7).map(normalizeMovie);
    }

    case "get_movie_details": {
      const movie = await getMovieDetail(args.movie_id);
      const director = movie.credits?.crew?.find((c) => c.job === "Director");
      const trailer = movie.videos?.results?.find(
        (v) => v.type === "Trailer" && v.site === "YouTube",
      );
      return {
        id: movie.id,
        title: movie.title,
        tagline: movie.tagline,
        year: movie.release_date?.slice(0, 4),
        rating: Math.round(movie.vote_average * 10) / 10,
        runtime: movie.runtime
          ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
          : null,
        overview: movie.overview,
        genres: movie.genres?.map((g) => g.name) ?? [],
        director: director?.name ?? null,
        cast: movie.credits?.cast?.slice(0, 5).map((c) => c.name) ?? [],
        budget: movie.budget > 0 ? `$${movie.budget.toLocaleString()}` : null,
        revenue:
          movie.revenue > 0 ? `$${movie.revenue.toLocaleString()}` : null,
        trailer: trailer ? `https://youtube.com/watch?v=${trailer.key}` : null,
        poster: movie.poster_path
          ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
          : null,
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/movies/${movie.id}`,
      };
    }

    case "get_similar_movies": {
      const movies = await getSimilarMovies(args.movie_id);
      return movies.slice(0, 7).map(normalizeMovie);
    }

    case "get_movie_by_genre": {
      const movies = await getMoviesByGenre(parseInt(args.genre_id));
      return movies.slice(0, 7).map(normalizeMovie);
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

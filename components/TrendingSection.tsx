import { Movie } from "../app/lib/types";
import MovieCard from "./MovieCard";

export default function TrendingSection({ movies }: { movies: Movie[] }) {
  return (
    <section className="pl-8 md:pl-16">
      <div className="flex justify-between items-end pr-8 md:pr-16 mb-6">
        <div>
          <span className="text-[#e50914] text-xs font-bold uppercase tracking-[0.2em] mb-2 block">
            Live Feed
          </span>
          <h2 className="text-3xl font-black tracking-tight">Trending Now</h2>
        </div>
        <a className="text-zinc-500 hover:text-red-500 text-sm font-medium transition-colors" href="#">
          See all
        </a>
      </div>
      <div className="flex gap-6 overflow-x-auto hide-scrollbar pr-16">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            year={movie.release_date?.slice(0, 4) ?? ""}
            rating={Math.round(movie.vote_average * 10) / 10}
            image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            genre=""
          />
        ))}
      </div>
    </section>
  );
}

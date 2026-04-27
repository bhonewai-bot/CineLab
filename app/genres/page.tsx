import GenresBentoGrid from "@/components/GenresBentoGrid";
import {
  getGenres,
  getMoviesByGenre,
  getNowPlayingMovies,
  getPopularMovies,
} from "../../lib/tmdb";
import MovieRow from "@/components/MovieRow";

export default async function GenresPage() {
  const [genres, popular, nowPlaying] = await Promise.all([
    getGenres(),
    getPopularMovies(),
    getNowPlayingMovies(),
  ]);

  // For each genre, fetch its top movie backdrop
  const genresWithImages = await Promise.all(
    genres.map(async (genre: { id: number; name: string }) => {
      try {
        const results = await getMoviesByGenre(genre.id);
        const topMovie = (results as { backdrop_path?: string }[]).find(
          (m) => m.backdrop_path,
        );
        return {
          ...genre,
          backdropImage: topMovie?.backdrop_path
            ? `https://image.tmdb.org/t/p/w780${topMovie.backdrop_path}`
            : "",
        };
      } catch {
        return { ...genre, backdropImage: "" };
      }
    }),
  );

  return (
    <>
      <div className="pt-32 pb-12 px-8 md:px-16">
        <span className="text-[#fabd00] uppercase tracking-[0.2em] font-bold text-xs">
          Curated Categories
        </span>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mt-4 mb-6">
          Explore <span className="text-[#e50914]">Genres</span>
        </h1>
        <p className="max-w-2xl text-zinc-400 text-lg leading-relaxed">
          Dive into a meticulously curated cinematic universe. From
          adrenaline-fueled blockbusters to poignant indie dramas, find your
          next obsession.
        </p>
      </div>

      <div className="px-8 md:px-16">
        <GenresBentoGrid genres={genresWithImages} />
      </div>

      <div className="pb-20 space-y-16 mt-20">
        <MovieRow
          label="Cinelab Favorites"
          title="Popular on Cinelab"
          movies={popular}
          isNew={false}
        />
        <MovieRow
          label="Freshly Added"
          title="New Releases"
          movies={nowPlaying}
          isNew
        />
      </div>
    </>
  );
}

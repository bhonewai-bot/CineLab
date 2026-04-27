import Hero from "@/components/Hero";
import {
  getNowPlayingMovies,
  getPopularMovies,
  getTrendingMovies,
} from "../lib/tmdb";
import MovieRow from "@/components/MovieRow";

export default async function Home() {
  const [popular, trending, nowPlaying] = await Promise.all([
    getPopularMovies(),
    getTrendingMovies(),
    getNowPlayingMovies(),
  ]);

  return (
    <>
      <Hero movies={trending.slice(0, 5)} />
      <div className="relative -mt-24 pb-20 space-y-16 z-20">
        <MovieRow
          label="Cinelab Favorites"
          title="Popular on Cinelab"
          movies={popular}
          isNew={false}
        />
        <MovieRow
          label="Live Feed"
          title="Trending Now"
          movies={trending}
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

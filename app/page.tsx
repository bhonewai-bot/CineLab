import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import NewReleasesRow from "@/components/NewReleasesRow";
import PopularRow from "@/components/PopularRow";
import TrendingSection from "@/components/TrendingSection";
import {
  getNowPlayingMovies,
  getPopularMovies,
  getTrendingMovies,
} from "./lib/tmdb";

export default async function Home() {
  const [popular, trending, nowPlaying] = await Promise.all([
    getPopularMovies(),
    getTrendingMovies(),
    getNowPlayingMovies(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <Hero movies={trending.slice(0, 5)} />
        <div className="relative -mt-24 pb-20 space-y-16 z-20">
          <PopularRow movies={popular} />
          <TrendingSection movies={trending} />
          <NewReleasesRow movies={nowPlaying} />
        </div>
      </main>
      <Footer />
    </>
  );
}

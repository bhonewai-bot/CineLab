import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import NewReleasesRow from "@/components/NewReleasesRow";
import PopularRow from "@/components/PopularRow";
import TrendingSection from "@/components/TrendingSection";

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export default async function Home() {
  const [popular, trending, nowPlaying] = await Promise.all([
    fetch(`${BASE}/api/movies?type=popular`, {
      next: { revalidate: 3600 },
    }).then((r) => r.json()),
    fetch(`${BASE}/api/movies?type=trending`, {
      next: { revalidate: 3600 },
    }).then((r) => r.json()),
    fetch(`${BASE}/api/movies?type=now_playing`, {
      next: { revalidate: 3600 },
    }).then((r) => r.json()),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <Hero movies={trending.results?.slice(0, 5)} />
        <div className="relative -mt-24 pb-20 space-y-16 z-20">
          <PopularRow movies={popular.results ?? []} />
          <TrendingSection movies={trending.results ?? []} />
          <NewReleasesRow movies={nowPlaying.results ?? []} />
        </div>
      </main>
      <Footer />
    </>
  );
}

import Footer from "@/components/Footer";
import GenresBentoGrid from "@/components/GenresBentoGrid";
import MobileNav from "@/components/MobileNav";
import Navbar from "@/components/Navbar";
import NewReleasesRow from "@/components/NewReleasesRow";
import PopularRow from "@/components/PopularRow";

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export default async function GenresPage() {
  const [genresData, popular, nowPlaying] = await Promise.all([
    fetch(`${BASE}/api/genres`, { next: { revalidate: 86400 } }).then((r) =>
      r.json(),
    ),
    fetch(`${BASE}/api/movies?type=popular`, {
      next: { revalidate: 3600 },
    }).then((r) => r.json()),
    fetch(`${BASE}/api/movies?type=now_playing`, {
      next: { revalidate: 3600 },
    }).then((r) => r.json()),
  ]);

  const genres = genresData.genres ?? [];

  // For each genre, fetch its top movie backdrop
  const genresWithImages = await Promise.all(
    genres.map(async (genre: { id: number; name: string }) => {
      try {
        const res = await fetch(`${BASE}/api/genres?id=${genre.id}`, {
          next: { revalidate: 3600 },
        });
        const data = await res.json();
        const topMovie = (data.results ?? []).find(
          (m: { backdrop_path: string }) => m.backdrop_path,
        );
        return {
          ...genre,
          backdropImage: topMovie
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
      <Navbar activePage="genres" />
      <main>
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
          <PopularRow movies={popular.results ?? []} />
          <NewReleasesRow movies={nowPlaying.results ?? []} />
        </div>
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}

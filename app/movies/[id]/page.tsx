import Image from "next/image";
import Link from "next/link";
import { MovieDetail, CastMember, CrewMember, Video, Movie } from "@/lib/types";
import { getMovieDetail, getPopularMovies } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";
import { TMDB_IMAGE } from "@/lib/utils";

export const revalidate = 86400;

export async function generateStaticParams() {
  const movies = await getPopularMovies();
  return movies.map((movie) => ({ id: movie.id.toString() }));
}

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let movie: MovieDetail;
  try {
    movie = (await getMovieDetail(id)) as MovieDetail;
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-400">
        Movie not found.
      </div>
    );
  }

  const director = movie.credits?.crew?.find(
    (c: CrewMember) => c.job === "Director",
  );
  const trailer =
    movie.videos?.results?.find(
      (v: Video) => v.type === "Trailer" && v.site === "YouTube" && v.official,
    ) ?? movie.videos?.results?.find((v: Video) => v.site === "YouTube");
  const cast = movie.credits?.cast?.slice(0, 8) ?? [];
  const similar = movie.similar?.results?.slice(0, 5) ?? [];
  const rating = Math.round(movie.vote_average * 10) / 10;
  const year = movie.release_date?.slice(0, 4);
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null;

  return (
    <>
      <main>
        {/* Backdrop Hero */}
        <section className="relative w-full h-[70vh] overflow-hidden">
          {movie.backdrop_path && (
            <Image
              src={`${TMDB_IMAGE}/original${movie.backdrop_path}`}
              alt={movie.title}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-[#131313] via-[#131313]/60 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-[#131313]/80 to-transparent" />
        </section>

        {/* Detail Content */}
        <div className="relative -mt-64 z-10 px-8 md:px-16 pb-20">
          <div className="flex flex-col md:flex-row gap-10 max-w-screen-2xl mx-auto">
            {/* Poster */}
            <div className="flex-none w-48 md:w-64 rounded-lg overflow-hidden shadow-2xl self-start mt-8">
              {movie.poster_path ? (
                <Image
                  src={`${TMDB_IMAGE}/w500${movie.poster_path}`}
                  alt={movie.title}
                  width={256}
                  height={384}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full aspect-2/3 bg-[#1c1b1b] flex items-center justify-center">
                  <span className="material-symbols-outlined text-zinc-600 text-5xl">
                    movie
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 pt-4 md:pt-12">
              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres?.map((g) => (
                  <span
                    key={g.id}
                    className="px-3 py-1 rounded-full bg-[#2a2a2a] text-zinc-300 text-xs font-bold uppercase tracking-wider"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
              {/* Title */}
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-3">
                {movie.title}
              </h1>
              {/* Tagline */}
              {movie.tagline && (
                <p className="text-[#e9bcb6] italic text-lg mb-4">
                  {movie.tagline}
                </p>
              )}
              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-zinc-400">
                <div className="flex items-center gap-1 text-[#fabd00] font-bold">
                  <span
                    className="material-symbols-outlined text-base"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span className="text-white">{rating}</span>
                  <span className="text-zinc-500 font-normal">/ 10</span>
                </div>
                {year && <span>{year}</span>}
                {runtime && <span>{runtime}</span>}
                {movie.status && (
                  <span className="px-2 py-0.5 rounded bg-[#1c1b1b] text-zinc-400 text-xs">
                    {movie.status}
                  </span>
                )}
                {director && (
                  <span>
                    Dir.{" "}
                    <span className="text-white font-medium">
                      {director.name}
                    </span>
                  </span>
                )}
              </div>
              {/* Overview */}
              <p className="text-zinc-300 text-base leading-relaxed max-w-2xl mb-8">
                {movie.overview}
              </p>
              {/* Actions */}
              <div className="flex flex-wrap gap-4 mb-10">
                {trailer && (
                  <a
                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-8 py-4 bg-linear-to-r from-[#e50914] to-[#ffb4aa] text-white rounded-lg font-bold hover:brightness-110 transition-all active:scale-95 shadow-xl"
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      play_arrow
                    </span>
                    Watch Trailer
                  </a>
                )}
                <Link
                  href="/"
                  className="flex items-center gap-2 px-8 py-4 bg-[#353534] text-[#e5e2e1] rounded-lg font-bold hover:bg-[#393939] transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                  Back
                </Link>
              </div>
            </div>
          </div>

          {/* Cast */}
          {cast.length > 0 && (
            <div className="max-w-screen-2xl mx-auto mt-16">
              <h2 className="text-2xl font-black tracking-tight mb-6">Cast</h2>
              <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                {cast.map((member: CastMember) => (
                  <div key={member.id} className="flex-none w-28 text-center">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-[#1c1b1b] mx-auto mb-2">
                      {member.profile_path ? (
                        <Image
                          src={`${TMDB_IMAGE}/w185${member.profile_path}`}
                          alt={member.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-zinc-600">
                            person
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-white text-xs font-bold leading-tight">
                      {member.name}
                    </p>
                    <p className="text-zinc-500 text-[10px] mt-0.5 leading-tight line-clamp-2">
                      {member.character}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Similar Movies */}
          {similar.length > 0 && (
            <div className="max-w-screen-2xl mx-auto mt-16">
              <h2 className="text-2xl font-black tracking-tight mb-6">
                Similar Movies
              </h2>
              <div className="flex gap-6 overflow-x-auto hide-scrollbar pr-4">
                {similar.map((m: Movie) => (
                  <MovieCard
                    key={m.id}
                    id={m.id}
                    title={m.title}
                    year={m.release_date?.slice(0, 4) ?? ""}
                    rating={Math.round(m.vote_average * 10) / 10}
                    image={
                      m.poster_path ? `${TMDB_IMAGE}/w500${m.poster_path}` : ""
                    }
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Movie } from "../lib/types";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

export default function SearchCard({ movie }: { movie: Movie }) {
  const year = movie.release_date?.slice(0, 4) ?? "—";
  const rating = Math.round(movie.vote_average * 10) / 10;
  const image = movie.poster_path
    ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
    : null;

  return (
    <Link href={`/movies/${movie.id}`} className="group cursor-pointer">
      <div className="aspect-2/3 overflow-hidden rounded-lg bg-[#1c1b1b] mb-4 relative">
        {image ? (
          <Image
            src={image}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600">
            <span className="material-symbols-outlined text-5xl">movie</span>
          </div>
        )}
        <div className="absolute top-3 right-3 px-2 py-1 bg-[#fabd00]/90 backdrop-blur rounded text-[10px] font-black text-[#261a00] flex items-center gap-1">
          <span
            className="material-symbols-outlined text-[12px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
          {rating}
        </div>
      </div>
      <h3 className="font-bold text-base group-hover:text-[#ffb4aa] transition-colors duration-300 leading-tight line-clamp-2">
        {movie.title}
      </h3>
      <p className="text-zinc-500 text-xs mt-1 uppercase tracking-tighter">
        {year}
      </p>
    </Link>
  );
}

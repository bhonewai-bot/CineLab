"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Movie } from "../app/lib/types";

type HeroProps = {
  movies?: Movie[];
};

const TMDB_IMAGE = "https://image.tmdb.org/t/p";

const FALLBACK: Movie = {
  id: 0,
  title: "THE NEON CURATOR",
  overview:
    "In a world where memories are digital currency, one man discovers a vintage film reel that could rewrite the history of the last century.",
  backdrop_path: "",
  poster_path: "",
  release_date: "",
  vote_average: 9.2,
  genre_ids: [],
};

const FADE_MS = 400;
const AUTO_ADVANCE_MS = 6000;

export default function Hero({ movies }: HeroProps) {
  const slides = movies && movies.length > 0 ? movies.slice(0, 5) : [FALLBACK];

  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true); // false = mid-crossfade

  const goTo = useCallback(
    (index: number) => {
      if (index === current) return;
      setVisible(false);
      setTimeout(() => {
        setCurrent(index);
        setVisible(true);
      }, FADE_MS);
    },
    [current],
  );

  const next = useCallback(
    () => goTo((current + 1) % slides.length),
    [current, slides.length, goTo],
  );

  const prev = useCallback(
    () => goTo((current - 1 + slides.length) % slides.length),
    [current, slides.length, goTo],
  );

  // Auto-advance timer
  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(next, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [next, slides.length]);

  const movie = slides[current];
  const nextMovie = slides[(current + 1) % slides.length];

  const backdropUrl = (m: Movie) =>
    m.backdrop_path
      ? `${TMDB_IMAGE}/original${m.backdrop_path}`
      : "https://images.squarespace-cdn.com/content/v1/51b3dc8ee4b051b96ceb10de/fa1f11d8-b7b3-4d2b-9d17-95ea6ed9ab7a/Poster+For+Ryan+Gosling%27s+Upcoming+Sci-Fi+Film+PROJECT+HAIL+MARY+From+Directors+Phil+Lord+and+Chris+Miller.jpg";

  const rating = Math.round(movie.vote_average * 10) / 10;
  const year = movie.release_date?.slice(0, 4);
  const isFallback = movie.id === 0;

  const fadeStyle = {
    opacity: visible ? 1 : 0,
    transition: `opacity ${FADE_MS}ms ease`,
  };

  return (
    <section className="relative w-full h-230.25 flex items-center overflow-hidden">
      {/* ── Background image ── */}
      <div className="absolute inset-0" style={fadeStyle}>
        <Image
          fill
          src={backdropUrl(movie)}
          alt={movie.title}
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 side-gradient" />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Invisible preload for the next slide — prevents flash on advance */}
      {slides.length > 1 && (
        <div className="sr-only" aria-hidden="true">
          <Image fill src={backdropUrl(nextMovie)} alt="" />
        </div>
      )}

      {/* ── Main content ── */}
      <div className="relative z-10 px-8 md:px-24 max-w-4xl" style={fadeStyle}>
        {/* Badges row */}
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-[#fabd00] text-[#6a4e00] text-[10px] font-bold tracking-widest px-3 py-1 rounded-full uppercase">
            {year ? `${year} • Trending` : "Exclusive Premiere"}
          </span>
          <div className="flex items-center gap-1 text-[#fabd00]">
            <span
              className="material-symbols-outlined text-sm!"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span className="text-sm font-bold">{rating}</span>
          </div>
          {slides.length > 1 && (
            <span className="text-xs text-white/40 font-medium ml-1 tabular-nums">
              {current + 1} / {slides.length}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-none uppercase">
          {movie.title}
        </h1>

        {/* Overview */}
        <p className="text-lg md:text-xl text-[#e9bcb6] max-w-2xl mb-10 leading-relaxed line-clamp-3">
          {movie.overview}
        </p>

        {/* CTA buttons */}
        {!isFallback && (
          <div className="flex flex-wrap gap-4">
            <Link
              href={`/movies/${movie.id}`}
              className="flex items-center gap-3 px-8 py-4 bg-linear-to-r from-[#e50914] to-[#ffb4aa] text-white rounded-lg font-bold hover:brightness-110 transition-all active:scale-95 shadow-xl"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                play_arrow
              </span>
              <span>Play Now</span>
            </Link>
            <Link
              href={`/movies/${movie.id}`}
              className="flex items-center gap-3 px-8 py-4 bg-[#353534] text-[#e5e2e1] rounded-lg font-bold hover:bg-[#393939] transition-all active:scale-95"
            >
              <span className="material-symbols-outlined">info</span>
              <span>View Details</span>
            </Link>
          </div>
        )}
      </div>

      {/* ── Prev / Next arrows ── */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center transition-all active:scale-90"
            aria-label="Previous film"
          >
            <span className="material-symbols-outlined text-white">
              chevron_left
            </span>
          </button>
          <button
            onClick={next}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center transition-all active:scale-90"
            aria-label="Next film"
          >
            <span className="material-symbols-outlined text-white">
              chevron_right
            </span>
          </button>
        </>
      )}

      {/* ── Dot indicators ── */}
      {slides.length > 1 && (
        <div className="absolute bottom-32 left-8 md:left-24 z-20 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{ transition: "all 0.3s ease" }}
              className={`rounded-full ${
                i === current
                  ? "w-6 h-2 bg-[#e50914]"
                  : "w-2 h-2 bg-white/35 hover:bg-white/65"
              }`}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes heroProgress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}

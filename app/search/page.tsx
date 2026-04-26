"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import MobileNav from "../../components/MobileNav";
import SearchCard from "../../components/SearchCard";
import { Movie } from "../lib/types";

const QUICK_FILTERS = ["Trending", "Sci-Fi", "Noir", "Documentary"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim() === "") {
      setResults([]);
      setTotalResults(0);
      setSearched(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setSearched(false);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?query=${encodeURIComponent(query)}`,
        );
        const data = await res.json();
        setResults(data.results ?? []);
        setTotalResults(data.total_results ?? 0);
      } catch {
        setResults([]);
        setTotalResults(0);
      } finally {
        setLoading(false);
        setSearched(true); // always mark as searched after attempt
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const handleQuickFilter = (label: string) => {
    if (label === "Trending") return;
    setQuery(label);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setTotalResults(0);
    setSearched(false);
    inputRef.current?.focus();
  };

  const isEmpty = searched && !loading && results.length === 0;
  const hasResults = !loading && results.length > 0;
  const isDefault = !searched && !loading && query === "";

  return (
    <>
      <Navbar activePage="search" />
      <main className="min-h-screen pt-32 pb-20 px-8 max-w-screen-2xl mx-auto">
        {/* Search Input */}
        <div className="mb-16">
          <div className="relative max-w-3xl mx-auto">
            {/* Input wrapper with icons inside */}
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-5 text-zinc-500 text-2xl pointer-events-none select-none">
                search
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-[#1c1b1b] rounded-xl py-5 pl-16 pr-14 text-xl focus:outline-none focus:ring-2 focus:ring-[#e50914] transition-all placeholder:text-zinc-600 text-[#e5e2e1] shadow-2xl"
                placeholder="Search movies, directors, or actors..."
                type="text"
              />
              {query && (
                <button
                  onClick={handleClear}
                  className="absolute right-5 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <span className="material-symbols-outlined text-2xl">
                    close
                  </span>
                </button>
              )}
            </div>

            {/* Quick filter chips */}
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              {QUICK_FILTERS.map((label, i) => (
                <button
                  key={label}
                  onClick={() => handleQuickFilter(label)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all hover:scale-105 ${
                    i === 0
                      ? "bg-[#fabd00] text-[#261a00]"
                      : "bg-[#2a2a2a] text-[#e5e2e1] hover:bg-[#353534]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading spinner */}
        {loading && (
          <div className="flex justify-center items-center py-32">
            <div className="w-10 h-10 border-2 border-[#e50914] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Results grid */}
        {hasResults && (
          <section className="mb-24">
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-3xl font-bold tracking-tight">Results</h2>
              <p className="text-zinc-500 text-sm uppercase tracking-widest">
                {totalResults.toLocaleString()} Results Found
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
              {results.map((movie) => (
                <SearchCard key={movie.id} movie={movie} />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {isEmpty && (
          <div className="flex flex-col items-center text-center max-w-lg mx-auto py-24">
            <div className="w-24 h-24 rounded-full bg-[#1c1b1b] flex items-center justify-center mb-8 border border-zinc-800/50">
              <span className="material-symbols-outlined text-zinc-600 text-5xl">
                sentiment_dissatisfied
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-4">No movies found</h2>
            <p className="text-zinc-500 mb-10 leading-relaxed">
              We couldn&apos;t find anything matching &ldquo;{query}&rdquo;. Try
              a different keyword, genre, or actor name.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleClear}
                className="px-8 py-3 rounded bg-linear-to-r from-[#e50914] to-[#ffb4aa] text-white font-bold text-sm tracking-wide active:scale-95 transition-all"
              >
                Clear Search
              </button>
              <a
                href="/genres"
                className="px-8 py-3 rounded bg-[#353534] text-[#e5e2e1] font-bold text-sm tracking-wide active:scale-95 transition-all"
              >
                Browse Genres
              </a>
            </div>
          </div>
        )}

        {/* Default state */}
        {isDefault && (
          <div className="flex flex-col items-center text-center max-w-lg mx-auto py-24">
            <span className="material-symbols-outlined text-zinc-700 text-7xl mb-6">
              movie_filter
            </span>
            <p className="text-zinc-500 text-lg">
              Start typing to search across thousands of movies.
            </p>
          </div>
        )}
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}

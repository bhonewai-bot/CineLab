"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import SearchCard from "@/components/SearchCard";
import { Movie } from "@/lib/types";
import { searchMovies } from "@/app/actions/search";

const QUICK_FILTERS = ["Trending", "Sci-Fi", "Noir", "Documentary"];
const SEARCH_DEBOUNCE_MS = 400;

type SearchState = {
  results: Movie[];
  totalResults: number;
  status: "idle" | "loading" | "success" | "error";
};

type Props = {
  initialQuery?: string;
  initialResults?: { results: Movie[]; total_results: number } | null;
};

export default function SearchClient({
  initialQuery = "",
  initialResults = null,
}: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [searchState, setSearchState] = useState<SearchState>(
    initialResults
      ? {
          results: initialResults.results,
          totalResults: initialResults.total_results,
          status: "success",
        }
      : { results: [], totalResults: 0, status: "idle" },
  );
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (!trimmedQuery) return;

    timeoutRef.current = setTimeout(async () => {
      try {
        router.replace(`/search?q=${encodeURIComponent(trimmedQuery)}`, {
          scroll: false,
        });

        const data = await searchMovies(trimmedQuery);
        setSearchState({
          results: data.results,
          totalResults: data.total_results,
          status: "success",
        });
      } catch {
        setSearchState({ results: [], totalResults: 0, status: "error" });
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query, router]);

  const updateQuery = (nextQuery: string) => {
    setQuery(nextQuery);
    if (!nextQuery.trim()) {
      setSearchState({ results: [], totalResults: 0, status: "idle" });
      router.replace("/search", { scroll: false });
      return;
    }
    setSearchState((s) => ({ ...s, status: "loading" }));
  };

  const handleQuickFilter = (label: string) => {
    if (label === "Trending") return;
    updateQuery(label);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    updateQuery("");
    inputRef.current?.focus();
  };

  const trimmedQuery = query.trim();
  const { results, totalResults, status } = searchState;
  const isLoading = status === "loading";
  const hasAttemptedSearch = trimmedQuery !== "" && status !== "idle";
  const hasResults = status === "success" && results.length > 0;
  const isEmpty = hasAttemptedSearch && !isLoading && results.length === 0;
  const isDefault = trimmedQuery === "" && status === "idle";

  return (
    <div className="min-h-screen pt-32 pb-20 px-8 max-w-screen-2xl mx-auto">
      {/* Search Input */}
      <div className="mb-16">
        <div className="relative max-w-3xl mx-auto">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-5 text-zinc-500 text-2xl pointer-events-none select-none">
              search
            </span>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => updateQuery(e.target.value)}
              className="w-full bg-[#1c1b1b] rounded-xl py-5 pl-16 pr-14 text-xl focus:outline-none focus:ring-2 focus:ring-[#e50914] transition-all placeholder:text-zinc-600 text-[#e5e2e1] shadow-2xl"
              placeholder="Search movies, directors, or actors..."
              type="text"
              autoFocus={!initialQuery}
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
                    ? "bg-[#fabd00] text-[#261a00] cursor-default"
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
      {isLoading && (
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
            We couldn&apos;t find anything matching &ldquo;{query}&rdquo;. Try a
            different keyword, genre, or actor name.
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleClear}
              className="px-8 py-3 rounded bg-linear-to-r from-[#e50914] to-[#ffb4aa] text-white font-bold text-sm tracking-wide active:scale-95 transition-all"
            >
              Clear Search
            </button>
            <Link
              href="/genres"
              className="px-8 py-3 rounded bg-[#353534] text-[#e5e2e1] font-bold text-sm tracking-wide active:scale-95 transition-all"
            >
              Browse Genres
            </Link>
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
    </div>
  );
}

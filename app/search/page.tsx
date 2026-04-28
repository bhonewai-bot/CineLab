import SearchClient from "@/components/SearchClient";
import { searchMovies } from "@/app/actions/search";

export const metadata = {
  title: "Search — Cinelab",
  description: "Search across thousands of movies on Cinelab.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  // If a query is in the URL (e.g. /search?q=inception),
  // pre-fetch results server-side so the page loads with data already rendered.
  // This makes shareable links and browser back/forward work instantly.
  const initialResults = q ? await searchMovies(q) : null;

  return (
    <SearchClient initialQuery={q ?? ""} initialResults={initialResults} />
  );
}

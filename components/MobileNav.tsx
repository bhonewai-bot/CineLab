import Link from "next/link";

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-zinc-900/90 backdrop-blur-xl border-t border-zinc-800/50 flex justify-around items-center h-16 z-50">
      <Link href="/" className="flex flex-col items-center gap-1 text-zinc-500">
        <span className="material-symbols-outlined">home</span>
        <span className="text-[10px] font-bold uppercase">Home</span>
      </Link>
      <Link href="/genres" className="flex flex-col items-center gap-1 text-zinc-500">
        <span className="material-symbols-outlined">grid_view</span>
        <span className="text-[10px] font-bold uppercase">Genres</span>
      </Link>
      <Link href="/search" className="flex flex-col items-center gap-1 text-zinc-500">
        <span className="material-symbols-outlined">search</span>
        <span className="text-[10px] font-bold uppercase">Search</span>
      </Link>
    </nav>
  );
}

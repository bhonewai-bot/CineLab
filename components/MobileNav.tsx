"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileNav() {
  const pathname = usePathname();
  const linkClass = (href: string) =>
    pathname === href
      ? "text-[#e50914] flex flex-col items-center gap-1"
      : "text-zinc-500 flex flex-col items-center gap-1";

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-zinc-900/90 backdrop-blur-xl border-t border-zinc-800/50 flex justify-around items-center h-16 z-50">
      <Link href="/" className={linkClass("/")}>
        <span className="material-symbols-outlined">home</span>
        <span className="text-[10px] font-bold uppercase">Home</span>
      </Link>
      <Link href="/genres" className={linkClass("/genres")}>
        <span className="material-symbols-outlined">grid_view</span>
        <span className="text-[10px] font-bold uppercase">Genres</span>
      </Link>
    </nav>
  );
}

import Link from "next/link";

type NavbarProps = {
  activePage?: "home" | "genres";
};

export default function Navbar({ activePage = "home" }: NavbarProps) {
  const linkClass = (page: string) =>
    activePage === page
      ? "text-red-600 font-bold relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-red-600 hover:text-red-500 transition-colors duration-300 active:scale-95"
      : "text-zinc-400 font-medium hover:text-red-500 transition-colors duration-300 active:scale-95";

  return (
    <nav className="fixed top-0 w-full z-50 bg-zinc-900/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      <div className="flex justify-between items-center px-8 h-20 max-w-screen-2xl mx-auto w-full font-['Inter'] tracking-tight antialiased">
        <div className="flex items-center gap-12">
          <span className="text-2xl font-black tracking-tighter text-red-600 uppercase">
            Cinelab
          </span>
          <div className="hidden md:flex items-center gap-8">
            <Link className={linkClass("home")} href="/">
              Home
            </Link>
            <a className={linkClass("genres")} href="/genres">
              Genres
            </a>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-zinc-400 hover:text-red-500 transition-colors duration-300 active:scale-95 flex items-center">
            <span className="material-symbols-outlined">search</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

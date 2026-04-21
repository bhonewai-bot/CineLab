export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-zinc-900/90 backdrop-blur-xl border-t border-zinc-800/50 flex justify-around items-center h-16 z-50">
      <button className="flex flex-col items-center gap-1 text-zinc-500">
        <span className="material-symbols-outlined">home</span>
        <span className="text-[10px] font-bold uppercase">Home</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-red-600">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
          grid_view
        </span>
        <span className="text-[10px] font-bold uppercase">Genres</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-zinc-500">
        <span className="material-symbols-outlined">search</span>
        <span className="text-[10px] font-bold uppercase">Search</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-zinc-500">
        <span className="material-symbols-outlined">person</span>
        <span className="text-[10px] font-bold uppercase">Profile</span>
      </button>
    </nav>
  );
}

import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full h-230.25 flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          fill
          src="https://images.squarespace-cdn.com/content/v1/51b3dc8ee4b051b96ceb10de/fa1f11d8-b7b3-4d2b-9d17-95ea6ed9ab7a/Poster+For+Ryan+Gosling%27s+Upcoming+Sci-Fi+Film+PROJECT+HAIL+MARY+From+Directors+Phil+Lord+and+Chris+Miller.jpg"
          alt="The Neon Curator backdrop"
        />
        <div className="absolute inset-0 side-gradient" />
        <div className="absolute inset-0 hero-gradient" />
      </div>
      <div className="relative z-10 px-8 md:px-24 max-w-4xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-[#fabd00] text-[#6a4e00] text-[10px] font-bold tracking-widest px-3 py-1 rounded-full uppercase">
            Exclusive Premiere
          </span>
          <div className="flex items-center gap-1 text-[#fabd00]">
            <span
              className="material-symbols-outlined text-sm!"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span className="text-sm font-bold">9.2</span>
          </div>
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-none">
          THE NEON
          <br />
          CURATOR
        </h1>
        <p className="text-lg md:text-xl text-[#e9bcb6] max-w-2xl mb-10 leading-relaxed">
          In a world where memories are digital currency, one man discovers a
          vintage film reel that could rewrite the history of the last century.
          An immersive journey through time and light.
        </p>
        <div className="flex flex-wrap gap-4">
          <button className="flex items-center gap-3 px-8 py-4 bg-linear-to-r from-[#e50914] to-[#ffb4aa] text-white rounded-lg font-bold hover:brightness-110 transition-all active:scale-95 shadow-xl">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              play_arrow
            </span>
            <span>Play Now</span>
          </button>
          <button className="flex items-center gap-3 px-8 py-4 bg-[#353534] text-[#e5e2e1] rounded-lg font-bold hover:bg-[#393939] transition-all active:scale-95">
            <span className="material-symbols-outlined">info</span>
            <span>View Details</span>
          </button>
        </div>
      </div>
    </section>
  );
}

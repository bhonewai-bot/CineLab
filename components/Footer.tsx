export default function Footer() {
  return (
    <footer className="w-full py-12 px-8 bg-zinc-950 border-t border-zinc-800/50">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-screen-2xl mx-auto w-full font-['Inter'] text-sm tracking-wide">
        <div className="flex flex-col items-center md:items-start gap-4">
          <span className="text-xl font-bold text-zinc-100">Cinelab</span>
          <p className="text-zinc-500 text-center md:text-left">
            © 2024 Cinelab. All rights reserved. The Digital Curator.
          </p>
        </div>
        <div className="flex gap-8">
          {["Privacy Policy", "Terms of Service", "Help Center", "Contact"].map((link) => (
            <a
              key={link}
              className="text-zinc-500 hover:text-amber-500 transition-colors duration-200 opacity-80 hover:opacity-100"
              href="#"
            >
              {link}
            </a>
          ))}
        </div>
        <div className="flex gap-4">
          <button className="w-10 h-10 rounded-full flex items-center justify-center bg-[#353534] text-zinc-400 hover:text-[#ffb4aa] transition-colors">
            <span className="material-symbols-outlined">share</span>
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center bg-[#353534] text-zinc-400 hover:text-[#ffb4aa] transition-colors">
            <span className="material-symbols-outlined">language</span>
          </button>
        </div>
      </div>
    </footer>
  );
}

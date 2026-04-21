import Image from "next/image";

type MovieCardProps = {
  title: string;
  year: string;
  genre: string;
  rating: number;
  image: string;
  isNew?: boolean;
};

export default function MovieCard({
  title,
  year,
  genre,
  rating,
  image,
  isNew,
}: MovieCardProps) {
  return (
    <div className="flex-none w-48 md:w-56 group cursor-pointer">
      <div className="relative aspect-2/3 rounded-lg overflow-hidden bg-[#1c1b1b] transition-transform duration-300 group-hover:scale-105">
        <Image fill src={image} alt={title} />
        {!isNew && (
          <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <button className="w-full py-2 bg-[#e50914] text-white rounded font-bold text-sm">
              Add to List
            </button>
          </div>
        )}
      </div>
      <div className="mt-4 space-y-1">
        {isNew ? (
          <>
            <h3 className="text-zinc-100 font-bold truncate">{title}</h3>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-zinc-500 font-bold">NEW</span>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                {genre}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                {year} • {genre}
              </span>
              <div className="flex items-center gap-0.5 text-[#fabd00]">
                <span
                  className="material-symbols-outlined text-[12px]!"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span className="text-[10px] font-bold">{rating}</span>
              </div>
            </div>
            <h3 className="text-zinc-100 font-bold truncate">{title}</h3>
          </>
        )}
      </div>
    </div>
  );
}

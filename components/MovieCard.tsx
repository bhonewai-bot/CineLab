import Image from "next/image";
import Link from "next/link";

type MovieCardProps = {
  id?: number;
  title: string;
  year: string;
  rating: number;
  image: string;
  isNew?: boolean;
  /**
   * "row"  — fixed width, for horizontal scroll rows (default)
   * "grid" — fills parent grid cell, rating badge on image, grayscale hover
   */
  variant?: "row" | "grid";
};

export default function MovieCard({
  id,
  title,
  year,
  rating,
  image,
  isNew,
  variant = "row",
}: MovieCardProps) {
  const isGrid = variant === "grid";

  const content = (
    <div className={`group cursor-pointer ${isGrid ? "w-full" : "flex-none w-48 md:w-56"}`}>
      {/* Image */}
      <div
        className={`relative aspect-2/3 rounded-lg overflow-hidden bg-[#1c1b1b] ${
          isGrid ? "mb-4" : "transition-transform duration-300 group-hover:scale-105"
        }`}
      >
        {image ? (
          <Image
            fill
            src={image}
            alt={title}
            className={`object-cover ${
              isGrid
                ? "transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                : ""
            }`}
            sizes={
              isGrid
                ? "(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                : "(max-width: 768px) 192px, 224px"
            }
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600">
            <span className="material-symbols-outlined text-5xl">movie</span>
          </div>
        )}

        {/* Grid variant: rating badge overlaid on image */}
        {isGrid && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-[#fabd00]/90 backdrop-blur rounded text-[10px] font-black text-[#261a00] flex items-center gap-1">
            <span
              className="material-symbols-outlined text-[12px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            {rating}
          </div>
        )}
      </div>

      {/* Info below image */}
      <div className={isGrid ? "" : "mt-4 space-y-1"}>
        {isGrid ? (
          <>
            <h3 className="font-bold text-base group-hover:text-[#ffb4aa] transition-colors duration-300 leading-tight line-clamp-2">
              {title}
            </h3>
            <p className="text-zinc-500 text-xs mt-1 uppercase tracking-tighter">{year}</p>
          </>
        ) : isNew ? (
          <>
            <h3 className="text-zinc-100 font-bold truncate">{title}</h3>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-zinc-500 font-bold">NEW</span>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                {year}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                {year}
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
            <h3 className="text-zinc-100 font-bold truncate group-hover:text-[#ffb4aa] transition-colors">
              {title}
            </h3>
          </>
        )}
      </div>
    </div>
  );

  if (id) {
    return <Link href={`/movies/${id}`}>{content}</Link>;
  }

  return content;
}

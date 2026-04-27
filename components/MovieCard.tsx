import Image from "next/image";
import Link from "next/link";

type MovieCardProps = {
  id?: number;
  title: string;
  year: string;
  rating: number;
  image: string;
  isNew?: boolean;
};

export default function MovieCard({
  id,
  title,
  year,
  rating,
  image,
  isNew,
}: MovieCardProps) {
  const content = (
    <div className="flex-none w-48 md:w-56 group cursor-pointer">
      <div className="relative aspect-2/3 rounded-lg overflow-hidden bg-[#1c1b1b] transition-transform duration-300 group-hover:scale-105">
        {image && (
          <Image
            fill
            src={image}
            alt={title}
            className="object-cover"
            sizes="(max-width: 768px) 192px, 224px"
          />
        )}
      </div>
      <div className="mt-4 space-y-1">
        {isNew ? (
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

import Image from "next/image";

type GenreCardProps = {
  name: string;
  image: string;
  colSpan?: string;
  rowSpan?: string;
  size?: "lg" | "md" | "sm";
  subtitle?: string;
  icon?: string;
};

export default function GenreCard({
  name,
  image,
  colSpan = "",
  rowSpan = "",
  size = "sm",
  subtitle,
  icon,
}: GenreCardProps) {
  return (
    <div
      className={`${colSpan} ${rowSpan} group relative overflow-hidden rounded-lg bg-[#1c1b1b] cursor-pointer
        ${size === "lg" ? "aspect-square md:aspect-auto" : "h-64"}`}
    >
      <Image
        src={image}
        alt={name}
        fill
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 genre-card-overlay" />
      <div
        className={`absolute bottom-0 left-0 ${size === "lg" ? "p-8" : "p-6"}`}
      >
        {icon && (
          <span
            className="material-symbols-outlined text-[#fabd00] mb-4 block"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {icon}
          </span>
        )}
        <h3
          className={`font-bold tracking-tight ${
            size === "lg" ? "text-3xl" : size === "md" ? "text-2xl" : "text-xl"
          }`}
        >
          {name}
        </h3>
        {subtitle && (
          <p className="text-zinc-400 text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Genre } from "../lib/types";
import GenreCard from "./GenreCard";

// Each row must add up to 6 columns at lg breakpoint
const bentoConfig: Record<
  string,
  {
    colSpan?: string;
    rowSpan?: string;
    size: "lg" | "md" | "sm";
    icon?: string;
    subtitle?: string;
  }
> = {
  // Row 1+2: Sci-Fi (2col × 2row) | Action (2col) | Horror (1col) | Comedy (1col)
  //          Sci-Fi continues     | Drama (2col)  | Thriller (1col) | Animation (1col)
  "Science Fiction": {
    colSpan: "col-span-1 md:col-span-2 lg:col-span-2",
    rowSpan: "md:row-span-2",
    size: "lg",
    icon: "rocket_launch",
    subtitle: "Infinite possibilities beyond the stars.",
  },
  Action: { colSpan: "col-span-1 md:col-span-2 lg:col-span-2", size: "md" },
  Horror: { colSpan: "col-span-1 lg:col-span-1", size: "sm" },
  Comedy: { colSpan: "col-span-1 lg:col-span-1", size: "sm" },
  Drama: {
    colSpan: "col-span-1 md:col-span-2 lg:col-span-2",
    size: "md",
    subtitle: "Editor's Choice",
  },
  Thriller: { colSpan: "col-span-1 lg:col-span-1", size: "sm" },
  Animation: { colSpan: "col-span-1 lg:col-span-1", size: "sm" },
  // Row 3: Documentary (3col) | Romance (3col)
  Documentary: {
    colSpan: "col-span-1 md:col-span-3 lg:col-span-3",
    size: "md",
    subtitle: "Real stories, real people.",
  },
  Romance: {
    colSpan: "col-span-1 md:col-span-3 lg:col-span-3",
    size: "md",
    subtitle: "Love in all its forms.",
  },
  // Row 4: Fantasy (1col) | Mystery (1col) | Music (2col) | Western (2col)
  Fantasy: { colSpan: "col-span-1 lg:col-span-1", size: "sm" },
  Mystery: { colSpan: "col-span-1 lg:col-span-1", size: "sm" },
  Music: { colSpan: "col-span-1 md:col-span-2 lg:col-span-2", size: "md" },
  Western: { colSpan: "col-span-1 md:col-span-2 lg:col-span-2", size: "md" },
};

const fallbackImages: Record<string, string> = {
  "Science Fiction":
    "https://image.tmdb.org/t/p/w780/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
  Action: "https://image.tmdb.org/t/p/w780/rktDFPbfHfUbArZ6OOOKsXcv0Bm.jpg",
  Horror: "https://image.tmdb.org/t/p/w780/pdfCr8W0wBCpdjbZXSxnKhZtosP.jpg",
  Comedy: "https://image.tmdb.org/t/p/w780/AfpAzBCFsERFwvWlIWQpPlvRgOE.jpg",
  Drama: "https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
  Thriller: "https://image.tmdb.org/t/p/w780/gKkl37BQuKTanygYQG1pyYgLVgf.jpg",
  Animation: "https://image.tmdb.org/t/p/w780/qbkAqmmEIZfrCO8ZQAuIuVMlWoV.jpg",
  Documentary:
    "https://image.tmdb.org/t/p/w780/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
  Romance: "https://image.tmdb.org/t/p/w780/avedvodAZUcwqevBfm8p4G2NziQ.jpg",
  Fantasy: "https://image.tmdb.org/t/p/w780/8rpDcsfLJypbO6vREc0547VKqEv.jpg",
  Mystery: "https://image.tmdb.org/t/p/w780/rktDFPbfHfUbArZ6OOOKsXcv0Bm.jpg",
  Music: "https://image.tmdb.org/t/p/w780/AfpAzBCFsERFwvWlIWQpPlvRgOE.jpg",
  Western: "https://image.tmdb.org/t/p/w780/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
};

type GenreWithImage = Genre & { backdropImage: string };

const MOOD_CHIPS = [
  "Gritty",
  "Heartwarming",
  "Mind-Bending",
  "Nostalgic",
  "Oscars Winner",
  "Hidden Gem",
];

export default function GenresBentoGrid({
  genres,
}: {
  genres: GenreWithImage[];
}) {
  const [activeMood, setActiveMood] = useState<string>("Gritty");

  const bentoGenres = genres.filter((g) => bentoConfig[g.name]);
  const orderedKeys = Object.keys(bentoConfig);
  const sortedGenres = [...bentoGenres].sort(
    (a, b) => orderedKeys.indexOf(a.name) - orderedKeys.indexOf(b.name),
  );

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {sortedGenres.map((genre) => {
          const config = bentoConfig[genre.name];
          return (
            <GenreCard
              key={genre.id}
              name={genre.name}
              image={genre.backdropImage || fallbackImages[genre.name] || ""}
              colSpan={config.colSpan}
              rowSpan={config.rowSpan}
              size={config.size}
              icon={config.icon}
              subtitle={config.subtitle}
            />
          );
        })}
      </div>

      {/* Mood filter chips */}
      <div className="mt-16">
        <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-6">
          Narrow by mood
        </h4>
        <div className="flex flex-wrap gap-3">
          {MOOD_CHIPS.map((label) => (
            <button
              key={label}
              onClick={() => setActiveMood(label)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all hover:scale-105 ${
                activeMood === label
                  ? "bg-[#fabd00] text-[#261a00]"
                  : "bg-[#2a2a2a] text-[#e5e2e1] font-medium hover:bg-[#353534]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

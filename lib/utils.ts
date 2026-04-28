export const formatRating = (avg: number) => Math.round(avg * 10) / 10;

export const extractYear = (date?: string) => date?.slice(0, 4) ?? "";

export const TMDB_IMAGE = "https://image.tmdb.org/t/p";

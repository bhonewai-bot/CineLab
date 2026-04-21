# Cinelab

A lightweight Next.js app for browsing and managing movies using [The Movie Database (TMDB) API](https://www.themoviedb.org/documentation/api). Supports full CRUD operations on movies.

## Features

- Browse movies from TMDB
- Create, read, update, and delete movie entries
- Built with Next.js (App Router) and TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- A TMDB API key — get one at [themoviedb.org](https://www.themoviedb.org/settings/api)

### Setup

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Create a `.env.local` file in the root and add your TMDB API key:

```env
TMDB_API_KEY=your_api_key_here
```

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Tech Stack

- [Next.js](https://nextjs.org) — React framework (App Router)
- [TypeScript](https://www.typescriptlang.org)
- [TMDB API](https://developer.themoviedb.org/docs) — Movie data source

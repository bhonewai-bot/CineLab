@AGENTS.md

# Cinelab — Claude Guidelines

## Project Overview

Cinelab is a small Next.js (App Router) + TypeScript project that performs CRUD operations using the TMDB (The Movie Database) API. Keep it simple and lightweight — this is not a large-scale app.

## Key Conventions

- Use the **App Router** (`app/` directory) with server and client components where appropriate
- Keep API calls to TMDB in dedicated service/utility files (e.g. `lib/tmdb.ts`)
- Use `.env.local` for the TMDB API key (`TMDB_API_KEY`)
- Prefer TypeScript strict typing throughout

## CRUD Operations

The app supports:

- **Create** — Add or favorite a movie entry
- **Read** — Fetch and display movies from TMDB
- **Update** — Edit movie details or notes
- **Delete** — Remove a movie entry

## What to Avoid

- Don't over-engineer — this is a sample/demo project
- Avoid adding heavy dependencies unless clearly necessary
- Don't commit `.env.local` or any API keys

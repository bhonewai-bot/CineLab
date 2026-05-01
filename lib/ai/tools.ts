export const tools = [
  {
    type: "function",
    function: {
      name: "get_trending_movies",
      description: "Get the current trending movies this week",
      parameters: {
        type: "object",
        properties: {
          time_window: {
            type: "string",
            enum: ["day", "week", "month"],
            description: "The time window to get the trending movies",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_movies",
      description: "Search movies by title, keyword, actor, or director name",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              "The search query e.g. 'Inception', 'Christopher Nolan', 'romantic comedy 2024'",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_movie_details",
      description:
        "Get full details about a specific movie including cast, runtime, budget, and trailer",
      parameters: {
        type: "object",
        properties: {
          movie_id: {
            type: "string",
            description: "The ID of the movie",
          },
        },
        required: ["movie_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_similar_movies",
      description: "Get similar movies to a specific movie",
      parameters: {
        type: "object",
        properties: {
          movie_id: {
            type: "string",
            description: "The TMDB movie ID to find similar movies for",
          },
        },
        required: ["movie_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_movie_by_genre",
      description: "Get movies by genre",
      parameters: {
        type: "object",
        properties: {
          genre_id: {
            type: "number",
            description: "The genre to get movies for",
          },
        },
        required: ["genre"],
      },
    },
  },
];

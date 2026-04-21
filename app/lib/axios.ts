import axios from "axios";

const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
  },
});

api.interceptors.request.use(
  (config) => config,
  (error) => {
    if (error.response?.status === 401) {
      // Call Refresh API Token
      // Call previous API again
      console.log("API failed: ", error.response?.status);
    }

    return Promise.reject(error);
  },
);

export default api;

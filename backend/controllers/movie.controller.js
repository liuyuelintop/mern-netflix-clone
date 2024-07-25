import { fetchFromTMDB } from "../services/tmdb.service.js";
export async function getTrendingMovie(req, res) {
  try {
    const data = await fetchFromTMDB(
      "https://api.themoviedb.org/3/trending/movie/day?language=en-US"
    );
    const randomMovie =
      data.results[Math.floor(Math.random() * data.results?.length)];
    res.status(200).json({ success: true, content: randomMovie }); // generic response name: content
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getMovieTrailers(req, res) {
  try {
    const { id } = req.params;
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`
    );
    res.status(200).json({ success: true, trailers: data.results }); // generic response name: content
  } catch (error) {
    if (error.message.includes("404")) {
      return res
        .status(404)
        .json({ success: false, message: "Movie not found" });
    }
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getMovieDetails(req, res) {
  try {
    const { id } = req.params;
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${id}?language=en-US`
    );
    res.status(200).json({ success: true, content: data }); // generic response name: content
  } catch (error) {
    if (error.message.includes("404")) {
      return res
        .status(404)
        .json({ success: false, message: "Movie not found" });
    }
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getSimilarMovies(req, res) {
  try {
    const { id } = req.params;
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`
    );
    res.status(200).json({ success: true, similar: data.results }); // generic response name: content
  } catch (error) {
    if (error.message.includes("404")) {
      return res
        .status(404)
        .json({ success: false, message: "Movie not found" });
    }
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getMoviesByCategory(req, res) {
  try {
    const { category } = req.params;
    validateCategory(category);
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`
    );
    res.status(200).json({ success: true, content: data.results }); // generic response name: content
  } catch (error) {
    if (error.message.includes("Invalid category")) {
      return res.status(400).json({ success: false, message: error.message });
    }
    if (error.message.includes("404")) {
      return res
        .status(404)
        .json({ success: false, message: "Failed to fetch data: 404" });
    }
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

const validateCategory = (category) => {
  const categories = ["popular", "top_rated", "upcoming", "now_playing"];
  if (!categories.includes(category)) {
    throw new Error("Invalid category");
  }
  return category;
};

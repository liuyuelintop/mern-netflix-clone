import { fetchFromTMDB } from "../services/tmdb.service.js";
export async function getTrendingTv(req, res) {
  try {
    const data = await fetchFromTMDB(
      "https://api.themoviedb.org/3/trending/tv/day?language=en-US"
    );
    const randomTv =
      data.results[Math.floor(Math.random() * data.results?.length)];
    res.status(200).json({ success: true, content: randomTv }); // generic response name: content
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getTvTrailers(req, res) {
  try {
    const { id } = req.params;
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/tv/${id}/videos?language=en-US`
    );
    res.status(200).json({ success: true, trailers: data.results }); // generic response name: content
  } catch (error) {
    if (error.message.includes("404")) {
      return res.status(404).json({ success: false, message: "Tv not found" });
    }
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getTvDetails(req, res) {
  try {
    const { id } = req.params;
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/tv/${id}?language=en-US`
    );
    res.status(200).json({ success: true, content: data }); // generic response name: content
  } catch (error) {
    if (error.message.includes("404")) {
      return res.status(404).json({ success: false, message: "Tv not found" });
    }
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getSimilarTvs(req, res) {
  try {
    const { id } = req.params;
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/tv/${id}/similar?language=en-US&page=1`
    );
    res.status(200).json({ success: true, similar: data.results }); // generic response name: content
  } catch (error) {
    if (error.message.includes("404")) {
      return res.status(404).json({ success: false, message: "Tv not found" });
    }
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getTvsByCategory(req, res) {
  try {
    const { category } = req.params;
    validateCategory(category);
    const data = await fetchFromTMDB(
      `https://api.themoviedb.org/3/tv/${category}?language=en-US&page=1`
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
  const categories = ["airing_today", "on_the_air", "popular", "top_rated"];
  if (!categories.includes(category)) {
    throw new Error("Invalid category");
  }
  return category;
};

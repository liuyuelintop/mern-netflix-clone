import { User } from "../models/user.model.js";
import { fetchFromTMDB } from "../services/tmdb.service.js";

//TODO: Check if ID exists already ? Don't add it if it has already been created
export async function searchPerson(req, res) {
  const { query } = req.params;
  try {
    const response = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=1`
    );

    if (response.results.length === 0) {
      return res.status(404).send(null);
    }

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        searchHistory: {
          id: response.results[0].id,
          image: response.results[0].profile_path,
          title: response.results[0].name,
          searchType: "person",
          createdAt: new Date(),
        },
      },
    });

    res.status(200).json({ success: true, content: response.results });
  } catch (error) {
    console.log("Error in searchPerson controller: ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function searchMovie(req, res) {
  const { query } = req.params;

  try {
    const response = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`
    );

    if (response.results.length === 0) {
      return res.status(404).send(null);
    }

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        searchHistory: {
          id: response.results[0].id,
          image: response.results[0].poster_path,
          title: response.results[0].title,
          searchType: "movie",
          createdAt: new Date(),
        },
      },
    });
    res.status(200).json({ success: true, content: response.results });
  } catch (error) {
    console.error("Error in searchMovie controller: ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function searchTv(req, res) {
  const { query } = req.params;

  try {
    const response = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`
    );

    if (response.results.length === 0) {
      return res.status(404).send(null);
    }

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        searchHistory: {
          id: response.results[0].id,
          image: response.results[0].poster_path,
          title: response.results[0].name,
          searchType: "tv",
          createdAt: new Date(),
        },
      },
    });
    res.status(200).json({ success: true, content: response.results });
  } catch (error) {
    console.error("Error in searchTv controller: ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getSearchHistory(req, res) {
  try {
    res.status(200).json({ success: true, content: req.user.searchHistory });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function removeItemFromSearchHistory(req, res) {
  let { id } = req.params; // type of id: string

  id = parseInt(id);
  //id may not in history, check it before removing
  const itemExists = req.user.searchHistory.some((item) => item.id === id);
  if (!itemExists) {
    return res
      .status(404)
      .json({ success: false, message: "Item not found in search history" });
  }

  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: {
        searchHistory: { id: id },
      },
    });

    res
      .status(200)
      .json({ success: true, message: "Item removed from search history" });
  } catch (error) {
    console.error(
      "Error in removeItemFromSearchHistory controller: ",
      error.message
    );
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

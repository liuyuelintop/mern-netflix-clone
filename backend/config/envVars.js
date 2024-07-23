import dotenv from "dotenv";

dotenv.config();

export const ENV_VARS = {
  MONGO_URI: process.env.MONGO_URI,
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET,
  NodeJS_ENV: process.env.NODE,
  TMDB_API_KEY: process.env.TMDB_API_KEY,
};

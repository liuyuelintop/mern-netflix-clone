import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "https://i.stack.imgur.com/l60Hf.png",
  },
  searchHistory: {
    type: Array,
    default: [],
  },
});

const user = mongoose.model("User", userSchema);

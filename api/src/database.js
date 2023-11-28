const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI;
require("./models/Genre");
require("./models/Videogame");
const { addGenres } = require("./handlers/genresHandler");

mongoose.connect(MONGODB_URI, {})
  .then(() => {
    addGenres();
    console.log("Database is conected");
  })
  .catch((err) => console.log(err));

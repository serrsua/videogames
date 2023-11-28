const { mongoose, Schema, model } = require("mongoose");

const videogameSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  plataforms: {
    type: [String],
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  released: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },

  // Hacemos aquí la relación con el modelo de géneros
  genres: [
    {
      type: Schema.Types.ObjectId,
      ref: "Genre",
    },
  ],
});

module.exports = model("Videogame", videogameSchema);
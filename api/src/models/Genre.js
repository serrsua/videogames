const { mongoose, Schema, model } = require("mongoose");

const genreSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  // Hacemos aquí la relación con el modelo de Videogame
  videogames: [
    {
      type: mongoose.Schema.Types.ObjetcId,
      ref: "Videogame",
    },
  ],
});

module.exports = model("Genre", genreSchema);

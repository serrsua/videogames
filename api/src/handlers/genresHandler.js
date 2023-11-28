// Este handler tendrá dos funciones:
// 1. Pedir los géneros a la API
// 2. Traer esos géneros ya guardados en la base de datos

const axios = require("axios");
const Genre = require("../models/Genre");
const { API_KEY, URL } = process.env;

const addGenres = async () => {
  const allGenres = await Genre.find({});

  if (allGenres.length) return;

  let genres = await axios(`${URL}/genres?key=${API_KEY}`);

  const promises = genres.data.results.map(async (genre) => {
    const newGenre = await Genre.create({
      name: genre.name,
    });
    return newGenre;
  });

  await Promise.all(promises);
};

const getAllGenres = async (req, res) => {
  try {
    const allGenres = await Genre.find();

    if (!allGenres) res.status(404).send("No se encontraron géneros");
    else res.status(200).json(allGenres);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  addGenres,
  getAllGenres,
};

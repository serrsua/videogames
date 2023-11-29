const axios = require("axios");
const Genre = require("../models/Genre");
const Videogame = require("../models/Videogame");
const ObjectId = require("mongodb").ObjectId;

const { API_KEY, URL } = process.env;

const url = `${URL}/games?key=${API_KEY}`;

// POST Game on BD
const createGame = async (req, res) => {
  try {
    const { name, description, plataforms, image, released, rating, genres } =
      req.body;

    if (
      !name ||
      !description ||
      !plataforms ||
      !image ||
      !released ||
      !rating ||
      !genres.length
    )
      throw new Error("Faltan datos");

    // Se crea el Videogame
    const game = await Videogame.create({
      name,
      description,
      plataforms,
      image,
      released,
      rating,
      genres,
    });

    // Obtiene los géneros por nombre en la BD
    const genresToAdd = await Genre.find({ name: { $in: genres } });

    // Agrega _id de {game} en cada genre de genresToAdd y lo retorna
    game.genres = genresToAdd.map((genre) => {
      genre.videogames.push(game._id);
      return genre;
    });

    // Espera que se cumplan las promesas haciendo save() en cada una
    // para que se guarde todo
    await Promise.all([
      game.save(),
      ...genresToAdd.map((genre) => genre.save()),
    ]);

    res.status(201).send("Juego creado correctamente");
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
};

// GET Games from API
const getApiGames = async (url, games = []) => {
  try {
    if (games.length >= 100) return games;

    const { next, results } = (await axios(url)).data;

    results.forEach((game) => {
      games.push({
        id: game.id,
        name: game.name,
        image: game.background_image,
        genres: game.genres,
      });
    });

    // uso recursividad para traer los games que estan en next
    return getApiGames(next, games);

  } catch (err) {
    return { err: err.message };
  }
};

// GET Game from BD
const getBDGames = async (req, res) => {
  try {
    const games = await Videogame.find();

    if (games) return games;
    else throw new Error("Ocurrió un error o no existen juegos en la BD");
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
};

// GET Game by ID
const getGameById = async (req, res) => {
  const { id } = req.params;

  // verifica si el id tiene letras, si es así es un id de MongoDB
  const containsLetter = /[a-zA-Z]/.test(id);

  try {
    if (!containsLetter) {
      // es un ID de la API
      let game = (await axios.get(`${URL}/games/${id}?key=${API_KEY}`)).data;

      if (game) return res.status(200).json(game);
      else return res.status(400).send("No existe juego con ese ID");
    } else {
      // es un id de la BD
      const game = await Videogame.findOne({ _id: id }).populate("genres");

      if (game) return res.status(200).json(game);
      else return res.status(400).send("No existe juego con ese ID");
    }
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
};

// GET Game by name
const getGameByName = async (name, gamesByName = []) => {
  let games = await Videogame.find({
    name: { $regex: name, $options: "i" },
  });

  if (!games) return res.status(404).json({ err: "No se encontró el juego" });

  const { results } = (
    await axios(`${URL}/games?search=${name}&key=${API_KEY}`)
  ).data;

  let apiGames = results;

  gamesByName = [...games, ...apiGames];

  return gamesByName.slice(0, 15);
};

// GET all Games
const getAllGames = async (req, res) => {
  const { name } = req.query;

  try {
    if (!name) {
      let bdGames = await getBDGames();
      let apiGames = await getApiGames(url);
      let allGames = [...bdGames, ...apiGames];

      res.status(200).json(allGames);
    } else {
      const gamesByName = await getGameByName(name);
      if (!gamesByName.length)
        return res
          .status(404)
          .json({ err: "No se econtró juego con ese nombre" });

      return res.status(200).json(gamesByName);
    }
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
};

module.exports = {
  getAllGames,
  getGameById,
  createGame,
};

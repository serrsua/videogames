const { Router } = require("express");
const { getAllGenres } = require("../handlers/genresHandler");

const genresRouter = Router();

genresRouter.get("/", getAllGenres);

module.exports = genresRouter;
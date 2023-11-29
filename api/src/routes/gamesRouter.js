const { Router } = require("express");
const {
  getAllGames,
  getGameById,
  createGame,
} = require("../handlers/gamesHandler");

const gamesRouter = Router();

gamesRouter.post("/", createGame);
gamesRouter.get("/", getAllGames); // trae todos los Games y también funciona "by name"
gamesRouter.get("/:id", getGameById);

module.exports = gamesRouter;

require("dotenv").config();

const app = require("./src/app");

// Conexion con DB de mongoose

require("./src/database");

app.listen(3001, () => {
  console.log("Server on port 3001");
});

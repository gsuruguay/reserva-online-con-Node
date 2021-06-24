require("dotenv").config();
module.exports = {
    url: process.env.DB_URL,
    db: process.env.DB_NOMBRE,
    coleccion: process.env.DB_COLECCION
  };
  
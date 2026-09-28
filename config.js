require('dotenv').config({ quiet: true });

if (!process.env.SECRET_KEY) {
  throw new Error("Variable d'environnement manquante : SECRET_KEY");
}

module.exports = {
  port: Number(process.env.PORT) || 3000,
  secretKey: process.env.SECRET_KEY,
};

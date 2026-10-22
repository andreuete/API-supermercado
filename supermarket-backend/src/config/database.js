const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("La variable MONGODB_URI no está configurada.");
  }

  await mongoose.connect(uri);
  console.log("Conectado a MongoDB");
}

module.exports = connectDB;

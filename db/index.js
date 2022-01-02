const mongoose = require("mongoose");

const { MONGODB_URL } = process.env;

async function connectDb() {
  try {
    const { connection } = await mongoose.connect(MONGODB_URL);
    console.log(`Conected to DB: ${connection.name}`);
  } catch (err) {
    console.error(`Error connecting to DB: ${err.message}`);
  }
}

module.exports = { connectDb };

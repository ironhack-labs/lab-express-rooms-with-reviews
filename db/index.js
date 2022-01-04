const mongoose = require('mongoose');

const { MONGODB_URL } = process.env;

async function connectDb() {
    try {
        const { connection } = await mongoose.connect(MONGODB_URL)
         console.log(`Connected to DB: ${connection.name}`)
    } catch (error) {
        console.error(`Error connecting to DB ${error.message}`)
    }
}

module.exports = { connectDb }
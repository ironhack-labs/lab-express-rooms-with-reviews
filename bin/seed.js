const mongoose = require('mongoose');
const { db, dbName } = require("../config/constants");

const RoomModel = require("../models/Room.model");
const data = require("../rooms.json");

mongoose
  .connect(db, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log(`Succesfully connected to ${dbName}`))
  .then(() => RoomModel.deleteMany())
  .then(() => RoomModel.insertMany(data))
  .then(() => console.log('Data successfully created'))
  .then(() => process.exit())
  .catch((error) => console.error('Error connecting to DB', error))

process.on('SIGINT', () => {
  mongoose.connection
    .close()
    .then(() => console.log('Successfully disconnected from DB'))
    .catch((e) => console.error('Error disconnecting from DB', e))
    .finally(() => process.exit())
})

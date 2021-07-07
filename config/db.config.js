const mongoose = require('mongoose');
const { db, dbName } = require("./constants");

mongoose
  .connect(db, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log(`Succesfully connected to ${dbName}`))
  .catch((error) => console.error('Error connecting to DB', error))

process.on('SIGINT', () => {
  mongoose.connection
    .close()
    .then(() => console.log('Successfully disconnected from DB'))
    .catch((e) => console.error('Error disconnecting from DB', e))
    .finally(() => process.exit())
})
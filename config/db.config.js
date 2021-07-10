const mongoose = require("mongoose");
const { db, dbName } = require("./constants.js");

mongoose 
  .connect(db, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log(`succesfully connected to ${dbName}`))
  .catch((error) => console.error('Error connectint to DB', error));

  process.on('SIGINT', () => {
    mongoose.connection
      .close()
      .then(() => console.log('Succesfully disconnected from DB'))
      .catch((e) => console.error('Error disconecting from DB', e))
      .finally(() => process.exit())
  });
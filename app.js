const app = require('express')();
require('./db').connectDb();
require('./config').config(app);

const indexRoutes = require('./routes')
app.use('/', indexRoutes);


module.exports = app
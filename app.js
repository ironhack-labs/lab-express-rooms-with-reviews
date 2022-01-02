require('./db').connectDb();

const app = require('express')();

require('./config').config(app);
require('./config/session.config').sessionInit(app);

app.use((req, res, next) => {
  console.log('session', req.session);
  next();
});

const { isLoggedIn } = require('./middlewares/auth.middlewares');

const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

const authRoutes = require('./routes/auth.routes');
app.use('/', authRoutes);

const privateRouter = require("./routes/private.routes");
app.use("/private", isLoggedIn, privateRouter);

module.exports = app;

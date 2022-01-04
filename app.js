const app = require("express")();
require("./db").connectDb();
require("./config").config(app);

require("./config/session.config").sessionInit(app);
app.use((req, res, next) => {
  console.log("session", req.session);
  next();
});
const indexRoutes = require("./routes");
app.use("/", indexRoutes);

module.exports = app;

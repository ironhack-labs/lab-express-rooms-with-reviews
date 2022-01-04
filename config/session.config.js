const session = require("express-session");
const MongoStore = require("connect-mongo");

const { SESS_SECRET, MONGODB_URL, NODE_ENV } = process.env;

const isProduction = NODE_ENV === "production";

function sessionInit(app) {
  app.set("trust proxy", 1);
  app.use(
    session({
      secret: SESS_SECRET,
      resave: true,
      saveUninitialized: false,
      cookie: {
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
        httpOnly: true,
        maxAge: 6000000,
      },
      store: MongoStore.create({
        mongoUrl: MONGODB_URL,
        ttl: 60 * 60 * 24,
      }),
    })
  );
}

module.exports = { sessionInit }
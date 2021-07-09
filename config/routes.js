const router = require("express").Router();
const passport = require("passport");
const miscController = require("../controllers/misc.controller");
const authController = require("../controllers/auth.controller");
const upload = require("./storage.config");

const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

router.get("/", miscController.index);

// Register
router.get("/register", authController.register);
router.post("/register", authController.doRegister);

// Login
router.get("/login", authController.login);
router.post("/login", authController.doLogin);
router.get(
  "/auth/google",
  passport.authenticate("google-auth", { scope: GOOGLE_SCOPES })
);
router.get("/auth/google/callback", authController.doLoginGoogle);
router.post("/logout", authController.logout);

module.exports = router;

const router = require("express").Router();
const passport = require("passport");
const miscController = require("../controllers/misc.controller");
const authController = require("../controllers/auth.controller");

const authMiddleware = require("../middlewares/auth.middleware");

// Locals uploads
// const multer = require('multer')
// const upload = multer({ dest: "./public/uploads/" });

// AUthenticate
// authMiddleware.isNotAuthenticated
// authMiddleware.isAuthenticated

const upload = require("./storage.config");

const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

router.get("/", miscController.index);

// Register
router.get(
  "/register",
  authMiddleware.isNotAuthenticated,
  authController.register
);
router.post(
  "/register",
  upload.single("image"),
  authMiddleware.isNotAuthenticated,
  authController.doRegister
);

// Login
router.get("/login", authMiddleware.isNotAuthenticated, authController.login);
router.post(
  "/login",
  authMiddleware.isNotAuthenticated,
  authController.doLogin
);
router.get(
  "/auth/google",
  passport.authenticate("google-auth", { scope: GOOGLE_SCOPES })
);
router.get(
  "/auth/google/callback",
  authMiddleware.isNotAuthenticated,
  authController.doLoginGoogle
);
router.post("/logout", authMiddleware.isAuthenticated, authController.logout);

router.get("/profile", authMiddleware.isAuthenticated, miscController.profile);

router.get("/rooms", miscController.rooms);

router.get(
  "/rooms/create",
  authMiddleware.isAuthenticated,
  miscController.createRoom
);
router.post(
  "/rooms/create",
  authMiddleware.isAuthenticated,
  miscController.doCreateRoom
);

router.get(
  "/rooms/:id/edit",
  authMiddleware.isAuthenticated,
  miscController.editRoom
);
router.post(
  "/rooms/:id/edit",
  authMiddleware.isAuthenticated,
  miscController.doEditRoom
);

router.post(
  "/rooms/:id/delete",
  authMiddleware.isAuthenticated,
  miscController.deleteRoom
);

router.get("/rooms/:id", authMiddleware.isAuthenticated, miscController.idRoom);

module.exports = router;

router.get("/", miscController.index);

router.get(
  "/activate/:token",
  authMiddleware.isNotAuthenticated,
  authController.activate
);

module.exports = router;

const router = require("express").Router();
const passport = require("passport");
const miscController = require("../controllers/misc.controller");
const authController = require("../controllers/auth.controller");
const usersController = require("../controllers/users.controller");
const roomsController = require("../controllers/rooms.controller");
const upload = require("./storage.config");

const authMiddleware = require("../middlewares/auth.middleware");

const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

//index
router.get("/", miscController.index);

// Register
router.get(
  "/register",
  authMiddleware.isNotAuthenticated,
  authController.register
);
router.post("/register", upload.single("image"), authController.doRegister);

// Login
router.get("/login", authMiddleware.isNotAuthenticated, authController.login);
router.post(
  "/login",
  authMiddleware.isNotAuthenticated,
  authController.doLogin
);

// Login Google
router.get(
  "/auth/google",
  authMiddleware.isNotAuthenticated,
  passport.authenticate("google-auth", { scope: GOOGLE_SCOPES })
);
router.get(
  "/auth/google/callback",
  authMiddleware.isNotAuthenticated,
  authController.doLoginGoogle
);

router.post("/logout", authMiddleware.isAuthenticated, authController.logout);

router.get(
  "/activate/:token",
  authMiddleware.isNotAuthenticated,
  authController.activateAccount
);

// Rooms
router.get("/rooms", roomsController.list);

router.get(
  "/rooms/create",
  authMiddleware.isAuthenticated,
  roomsController.create
);
router.post(
  "/rooms/create",
  authMiddleware.isAuthenticated,
  roomsController.doCreate
);
router.get(
  "/rooms/:id",
  roomsController.detail
);

// Profile

router.get(
  "/private/profile",
  authMiddleware.isAuthenticated,
  usersController.profile
);

router.get(
  "/private/my-rooms",
  authMiddleware.isAuthenticated,
  usersController.myRooms
);
router.post(
  "/private/my-rooms/:id/delete",
  authMiddleware.isAuthenticated,
  usersController.deleteRoom
);

router.get(
  "/private/my-rooms/:id/edit",
  authMiddleware.isAuthenticated,
  usersController.editRoom
);
router.post(
  "/private/my-rooms/:id/edit",
  authMiddleware.isAuthenticated,
  usersController.doEditRoom
);

module.exports = router;

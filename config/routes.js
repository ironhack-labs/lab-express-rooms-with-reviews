const router = require("express").Router();
const passport = require("passport");
const miscController = require("../controllers/misc.controller");
const authController = require("../controllers/auth.controller");

const authMiddleware = require("../middlewares/auth.middleware");

// const multer = require('multer')
// const upload = multer({ dest: "./public/uploads/" });

// authMiddleware.isNotAuthenticated
// authMiddleware.isAuthenticated

const upload = require("./storage.config");

const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

router.get("/", miscController.index);

// Register
router.get("/register", authController.register);
router.post("/register", upload.single("image"), authController.doRegister);

// Login
router.get("/login", authController.login);
router.post("/login", authController.doLogin);
router.get(
  "/auth/google",
  passport.authenticate("google-auth", { scope: GOOGLE_SCOPES })
);
router.get("/auth/google/callback", authController.doLoginGoogle);
router.post("/logout", authController.logout);

router.get("/profile", authMiddleware.isAuthenticated, miscController.profile)

router.get("/rooms", authMiddleware.isAuthenticated, miscController.rooms);

router.get("/rooms/create", miscController.createRoom);
router.post("/rooms/create", miscController.doCreateRoom);

router.get("/rooms/:id/edit", miscController.editRoom);
router.post("/rooms/:id/edit", miscController.doEditRoom);

router.post("/rooms/:id/delete", miscController.deleteRoom);

router.get("/rooms/:id", miscController.idRoom);

module.exports = router;

router.get('/', miscController.index);

router.get("/activate/:token", authController.activate);

module.exports = router;

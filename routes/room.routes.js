const router = require("express").Router();
const {
  getRoom,
  room,
  getEditRoom,
  editRoom,
  getDeleteRoom,
  deleteRoom,
} = require("../controllers/room.controllers");
const { isLoggedIn } = require("../middlewares/auth.middlewares");

const multer = require("multer");
const upload = multer({ dest: "./public/uploads" });

router
  .get("/room/:id", isLoggedIn, getEditRoom)
  .get("/room", isLoggedIn, getRoom)
  .get("/room/delete/:id", isLoggedIn, getDeleteRoom)
  .post("/room/:id", isLoggedIn, upload.single("image"), editRoom)
  .post("/room", isLoggedIn, upload.single("image"), room)
  .post("/room/delete/:id", isLoggedIn, deleteRoom);

module.exports = router;

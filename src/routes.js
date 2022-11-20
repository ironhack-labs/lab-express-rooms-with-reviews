import { Router } from "express";

import authMiddleware from "./app/middlewares/auth.js";
import uploadConfig from "./config/cloudinary.js";

import SessionController from "./app/controllers/SessionController.js";
import UserController from "./app/controllers/UserController.js";
import RoomController from "./app/controllers/RoomController.js";

const routes = new Router();

routes.post("/register", UserController.store);

routes.post("/sessions", SessionController.store);

routes.use(authMiddleware);

routes.put("/register", UserController.update);
routes.post("/rooms", uploadConfig.single("image"), RoomController.store);
routes.get("/rooms", RoomController.show);
routes.put("/rooms", uploadConfig.single("image"), RoomController.update);
routes.delete("/rooms", RoomController.destroy);

routes.post("/logout", SessionController.destroy);

export default routes;

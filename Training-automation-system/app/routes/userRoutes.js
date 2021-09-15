import express from "express";
import UserController from "../controllers/userController";

const initUserRoutes = () => {
  const userRoutes = express.Router();

  userRoutes.get("/logout", UserController.logout);
  userRoutes.get("/dashboard", UserController.dashboard);
  userRoutes.post("/email", UserController.email);
  userRoutes.get("/refreshToken", UserController.refreshToken);

  return userRoutes;
};

export default initUserRoutes;

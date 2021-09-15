import express from "express";
import { LoginController } from "../controllers";

const initLoginRoutes = () => {
  const loginRoutes = express.Router();

  loginRoutes.get("/", LoginController.login);  
  loginRoutes.get("/gmail", LoginController.gmail);

  return loginRoutes;
};

export default initLoginRoutes;
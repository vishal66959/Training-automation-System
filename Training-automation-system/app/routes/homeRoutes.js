import express from "express";
import { HomeController } from "../controllers";

const initHomeRoutes = () => {
  const homeRoutes = express.Router();
  homeRoutes.get("/", HomeController.home);
  return homeRoutes;
};

export default initHomeRoutes;

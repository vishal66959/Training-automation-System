import express from "express";
import { EmpController } from "../controllers";

const initEmpRoutes = () => {
  const empRoutes = express.Router();
  empRoutes.get("/show", EmpController.show);
  empRoutes.post("/setAdmin", EmpController.setAdmin);
  empRoutes.post("/setHr", EmpController.setHr);
  empRoutes.delete("/delete", EmpController.delete);
 
  return empRoutes;
};

export default initEmpRoutes;

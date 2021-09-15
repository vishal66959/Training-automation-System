import express from "express";
import { PlanController } from "../controllers";

const initPlanRoutes = () => {
  const planRoutes = express.Router();

  planRoutes.get("/", PlanController.show);
  planRoutes.get("/adminhr", PlanController.adminhr);
  planRoutes.get("/trainerPlans", PlanController.trainerPlans);
  planRoutes.post("/create", PlanController.create);
  planRoutes.post("/planTrainers", PlanController.planTrainers);
  planRoutes.post("/planSchedules", PlanController.planSchedules);
  planRoutes.post("/planTopics", PlanController.planTopics);
  planRoutes.patch("/update", PlanController.update);
  planRoutes.delete("/delete", PlanController.delete);

  return planRoutes;
};
export default initPlanRoutes;

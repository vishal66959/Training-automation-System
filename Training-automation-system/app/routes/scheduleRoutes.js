import express from "express";
import { ScheduleController } from "../controllers";

const initScheduleRoutes = () => {
  const scheduleRoutes = express.Router();

  scheduleRoutes.get("/", ScheduleController.show);
  scheduleRoutes.get("/trainerschedules", ScheduleController.trainerschedules);
  scheduleRoutes.get("/traineeSchedules", ScheduleController.traineeSchedules);
  scheduleRoutes.post("/create", ScheduleController.create);
  scheduleRoutes.patch("/update", ScheduleController.update);
  scheduleRoutes.delete("/delete", ScheduleController.delete);

  return scheduleRoutes;
};

export default initScheduleRoutes;

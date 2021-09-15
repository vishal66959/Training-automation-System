import express from "express";
import { TopicController } from "../controllers";

const initTopicRoutes = () => {
  const topicRoutes = express.Router();

  topicRoutes.get("/", TopicController.show);
  topicRoutes.post("/create", TopicController.create);
  topicRoutes.patch("/update", TopicController.update);
  topicRoutes.delete("/delete", TopicController.delete);

  return topicRoutes;
};

export default initTopicRoutes;

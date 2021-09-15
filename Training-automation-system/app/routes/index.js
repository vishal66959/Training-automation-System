import initPlanRoutes from "./planRoutes";
import initScheduleRoutes from "./scheduleRoutes";
import initTopicRoutes from "./topicRoutes";
import initEmpRoutes from "./empRoutes";
import initLoginRoutes from "./loginRoutes";
import initUserRoutes from "./userRoutes";
import initHomeRoutes from "./homeRoutes";

const initRoutes = app => {
  app.use(`/plan`, initPlanRoutes());
  app.use(`/home`, initHomeRoutes());
  app.use(`/user`, initUserRoutes());
  app.use(`/schedule`, initScheduleRoutes());
  app.use(`/topic`, initTopicRoutes());
  app.use(`/emp`, initEmpRoutes());
  app.use(`/login`, initLoginRoutes());
  app.use(`/`, initHomeRoutes());

};

export default initRoutes;

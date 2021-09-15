import config from "config";
import * as express from "./express";
import logger from "./logger";

const start = () => {
  const port = config.get("port");

  const appStartMessage = () => {
    const env = process.env.NODE_ENV;
    logger.debug(`API is Initialized`);
    logger.info(`App Name : ${config.app.title}`);
    logger.info(`Server Name : ${config.app.name}`);
    logger.info(`Environment  : ${env || "development"}`);
    logger.info(`App Port : ${port}`);
    logger.info(`Process Id : ${process.pid}`);
  };

  const app = express.init();
  app.listen(port, appStartMessage);
};

export default start;

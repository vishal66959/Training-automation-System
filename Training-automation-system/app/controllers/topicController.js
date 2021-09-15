import logger from "../../lib/logger";
import Responder from "../../lib/expressResponder";
import { AuthenticationError, ForbiddenError } from "../errors";
import { createConnection } from "typeorm";
import { getConnection } from "typeorm";
import { Topic } from "../models/Topic";

export default class TopicController {
  static show(req, res) {
    if (req.session.employee) {
      let topics;
      createConnection()
        .then(async connection => {
          topics = await getConnection()
            .createQueryBuilder()
            .select("topic")
            .from(Topic, "topic")
            .getMany();
          await connection.close();
        })
        .catch(error => logger.info(error));
      Responder.success(res, JSON.stringify(topics));
    } else {
      res.cookie("token", "");
      Responder.operationFailed(
        res,
        new AuthenticationError("Please Login First")
      );
    }
  }

  static create(req, res) {
    if (req.session.employee) {
      createConnection()
        .then(async connection => {
          await connection.manager.save(req.body.topic);
          await connection.close();
        })
        .catch(error => logger.info(error));
    } else {
      res.cookie("token", "");
      Responder.operationFailed(
        res,
        new AuthenticationError("Please Login First")
      );
    }
  }

  static update(req, res) {
    if (req.session.employee) {
      createConnection()
        .then(async connection => {
          await connection.manager.save(req.body.topic);
          await connection.close();
        })
        .catch(error => logger.info(error));
    } else {
      res.cookie("token", "");
      Responder.operationFailed(
        res,
        new AuthenticationError("Please Login First")
      );
    }
  }

  static delete(req, res) {
    if (req.session.employee) {
      if (
        req.session.employee.designation === "admin" ||
        req.session.employee.designation === "hr"
      ) {
        createConnection()
          .then(async connection => {
            await getConnection()
              .createQueryBuilder()
              .delete()
              .from(Topic)
              .where("topicId = :id", { id: req.body.topic.topicId })
              .execute();
            await connection.close();
          })
          .catch(error => logger.info(error));
      } else {
        req.session.destroy(function() {
          logger.info("user logged out forecfully.");
        });
        Responder.operationFailed(
          res,
          new ForbiddenError(
            "You are not authorised for the resourse you are trying to access"
          )
        );
      }
    } else {
      res.cookie("token", "");
      Responder.operationFailed(
        res,
        new AuthenticationError("Please Login First")
      );
    }
  }
}

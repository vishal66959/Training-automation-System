import { AuthenticationError, ForbiddenError } from "../errors";
import logger from "../../lib/logger";
import { Plan } from "../models/Plan";
import { createConnection } from "typeorm";
import { getConnection } from "typeorm";
import Responder from "../../lib/expressResponder";
export default class PlanController {
  static show(req, res) {
    if (req.session.employee) {
      if (
        req.session.employee.designation === "admin" ||
        req.session.employee.designation === "hr"
      ) {
        let plans;
        createConnection()
          .then(async connection => {
            plans = await getConnection()
              .createQueryBuilder()
              .select("plan")
              .from(Plan, "plan")
              .getMany();
            await connection.close();
            logger.info("inside loge");
            Responder.success(res, plans);
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

  static planTopics(req, res) {
    if (req.session.employee) {
      let trainers;
      createConnection()
        .then(async connection => {
          trainers = await getConnection()
            .createQueryBuilder(Plan, "plan")
            .leftJoinAndSelect("plan.Trainer", "trainers")
            .where("plan.planId = :id", {
              id: req.body.plan.planId
            })
            .getMany();
          await connection.close();
        })
        .catch(error => logger.info(error));

      let trainerEmployee = false;
      for (emp of trainers.Trainer) {
        if (req.session.employee.employeeId === emp.employeeId) {
          trainerEmployee = true;
          break;
        }
      }
      if (
        req.session.employee.designation === "admin" ||
        req.session.employee.designation === "hr" ||
        trainerEmployee
      ) {
        let topics;
        createConnection()
          .then(async connection => {
            topics = await getConnection()
              .createQueryBuilder(Plan, "plan")
              .leftJoinAndSelect("plan.topics", "topics")
              .where("plan.planId = :id", {
                id: req.body.plan.planId
              })
              .getMany();
            await connection.close();
          })
          .catch(error => logger.info(error));
        Responder.success(res, topic);
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

  static planSchedules(req, res) {
    if (req.session.employee) {
      if (
        req.session.employee.designation === "admin" ||
        req.session.employee.designation === "hr"
      ) {
        let schedules;
        createConnection()
          .then(async connection => {
            schedules = await getConnection()
              .createQueryBuilder(Plan, "plan")
              .leftJoinAndSelect("plan.schedule", "schedules")
              .where("plan.planId = :id", {
                id: req.body.plan.planId
              })
              .getMany();
            await connection.close();
          })
          .catch(error => logger.info(error));
        Responder.success(res, schedles);
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

  static planTrainers(req, res) {
    if (req.session.employee) {
      let trainers;
      createConnection()
        .then(async connection => {
          trainers = await getConnection()
            .createQueryBuilder(Plan, "plan")
            .leftJoinAndSelect("plan.Trainer", "trainers")
            .where("plan.planId = :id", {
              id: req.body.plan.planId
            })
            .getMany();
          await connection.close();
        })
        .catch(error => logger.info(error));

      let trainerEmployee = false;
      for (emp of trainers.Trainer) {
        if (req.session.employee.employeeId === emp.employeeId) {
          trainerEmployee = true;
          break;
        }
      }
      if (
        req.session.employee.designation === "admin" ||
        req.session.employee.designation === "hr" ||
        trainerEmployee
      ) {
        Responder.success(res, trainers);
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
  static adminhr(req, res) {
    if (req.session.employee) {
      if (
        req.session.employee.designation === "admin" ||
        req.session.employee.designation === "hr"
      ) {
        let plans;
        createConnection()
          .then(async connection => {
            plans = await getConnection()
              .createQueryBuilder()
              .select("plan")
              .from(Plan, "plan")
              .where("plan.adminhr = :id", {
                id: req.session.employee.employeeId
              })
              .getMany();
            await connection.close();
          })
          .catch(error => logger.info(error));
        Responder.success(res, plans);
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

  static trainerPlans(req, res) {
    if (req.session.employee) {
      let plans;
      createConnection()
        .then(async connection => {
          plans = await getConnection()
            .createQueryBuilder(Employee, "emp")
            .leftJoinAndSelect("emp.trainerPlan", "plans")
            .where("emp.employeeID = :id", {
              id: req.session.employee.employeeId
            })
            .getMany();
          await connection.close();
          Responder.success(res, plans);
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

  static create(req, res) {
    if (req.session.employee) {
      if (
        req.session.employee.designation === "admin" ||
        req.session.employee.designation === "hr"
      ) {
        let plan = new Plan();
        plan.name = req.body.planName;
        plan.description = req.body.description;
        plan.adminhr = req.session.employee;
        plan.Trainer = req.body.Trainer;
        plan.topics = req.body.topics;
        createConnection()
          .then(async connection => {
            await connection.manager.save(plan);
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

  static update(req, res) {
    if (req.session.employee) {
      if (
        req.session.employee.designation === "admin" ||
        req.session.employee.designation === "hr"
      ) {
        createConnection()
          .then(async connection => {
            await connection.manager.save(req.body.plan);
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
              .from(Plan)
              .where("planId = :id", { id: req.body.plan.planId })
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

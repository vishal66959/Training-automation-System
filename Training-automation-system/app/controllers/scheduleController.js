import { createConnection } from "typeorm";
import { getConnection } from "typeorm";
import logger from "../../lib/logger";
import { AuthenticationError, ForbiddenError } from "../errors";
import Responder from "../../lib/expressResponder";
import { Schedule } from "../models/Schedule";
import { Plan } from "../models/Plan";
import { Employee } from "../models/Employee";

export default class ScheduleController {
  static show(req, res) {
    if (req.session.employee) {
      if (
        req.session.employee.designation === "admin" ||
        req.session.employee.designation === "hr"
      ) {
        let schedules;
        createConnection()
          .then(async connection => {
            schedules = await getConnection()
              .createQueryBuilder()
              .select("schedule")
              .from(Schedule, "schedule")
              .getMany();
            await connection.close();
          })
          .catch(error => logger.info(error));
        Responder.success(res, JSON.stringify(schedules));
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

  static trainerschedules(req, res) {
    if (req.session.employee) {
      let schedules;
      createConnection()
        .then(async connection => {
          schedules = await getConnection()
            .createQueryBuilder(Employee, "emp")
            .leftJoinAndSelect("emp.trainerSchedule", "schedule")
            .where("emp.employeeId = :id", {
              id: req.session.employee.employeeId
            })
            .getMany();
          await connection.close();
        })
        .catch(error => logger.info(error));
      Responder.success(res, JSON.stringify(schedules));
    } else {
      res.cookie("token", "");
      Responder.operationFailed(
        res,
        new AuthenticationError("Please Login First")
      );
    }
  }

  static traineeSchedules(req, res) {
    if (req.session.employee) {
      createConnection()
        .then(async connection => {
          let schedules = await getConnection()
            .createQueryBuilder(Employee, "emp")
            .leftJoinAndSelect("emp.traineeSchedule", "schedule")
            .where("emp.employeeId = :id", {
              id: req.session.employee.employeeId
            })
            .getMany();
          await connection.close();
        })
        .catch(error => logger.info(error));
      Responder.success(res, JSON.stringify(schedules));
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
      for (emp of trainers) {
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
        let schedule = new Schedule();
        schedule.name = name;
        schedule.plan = req.body.plan;
        schedule.date = new Date()
          .toJSON()
          .slice(0, 10)
          .replace(/-/g, "/");
        schedule.Trainee = req.body.trainee;
        schedule.Trainer = trainers.Trainer;
        schedule.day = req.body.day;
        createConnection()
          .then(async connection => {
            await connection.manager.save(schedule);
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
      for (emp of trainers) {
        if (req.session.employee.employeeId === emp.employeeId) {
          trainerEmployee = true;
          break;
        }
      }
      if (
        trainerEmployee ||
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
              .from(Schedule)
              .where("scheduleId = :id", { id: req.body.schedule.scheduleId })
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

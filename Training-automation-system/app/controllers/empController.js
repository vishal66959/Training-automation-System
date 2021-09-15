import { createConnection } from "typeorm";
import { getConnection } from "typeorm";

import { AuthenticationError, ForbiddenError } from "../errors";
import logger from "../../lib/logger";
import Responder from "../../lib/expressResponder";
import { Employee } from "../models/Employee";

export default class EmpController {
  static show(req, res) {
    if (req.session.employee) {
      if (req.session.employee.designation === "admin") {
        let employee;
        createConnection().then(async connection => {
          employee = await getConnection()
            .createQueryBuilder()
            .select("Employee")
            .from(Employee, "Employee")
            .getMany();
          await connection.close();
          logger.info(employee);
          Responder.success(res,employee);
        }).catch(error => {
          logger.info(error);
          Responder.operationFailed(
            res,
            new ServiceUnavailableError(
              "Database Problem"
            )
          );
        });
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

  static setAdmin(req, res) {
    if (req.session.employee) {
      if (req.session.employee.designation === "admin") {
        req.body.employee.designation = "admin";
        createConnection()
          .then(async connection => {
            await connection.manager.save(employee);
            await connection.close();
          })
          .catch(error => {
            logger.info(error);
            Responder.operationFailed(
              res,
              new ServiceUnavailableError(
                "Database Problem"
              )
            );
          })      } else {
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

  static setHr(req, res) {
    if (req.session.employee) {
      if (req.session.employee.designation === "admin") {
        req.body.employee.designation = "hr";
        createConnection()
          .then(async connection => {
            await connection.manager.save(employee);
            await connection.close();
          })
          .catch(error => {
            logger.info(error);
            Responder.operationFailed(
              res,
              new ServiceUnavailableError(
                "Database Problem"
              )
            );
          })      } else {
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
      if (req.session.employee.designation === "admin") {
        createConnection()
          .then(async connection => {
            await getConnection()
              .createQueryBuilder()
              .delete()
              .from(Employee)
              .where("employeeId = :id", { id: req.body.employee.employeeId })
              .execute();
            await connection.close();
          })
          .catch(error => {
            logger.info(error);
            Responder.operationFailed(
              res,
              new ServiceUnavailableError(
                "Database Problem"
              )
            );
          })      } else {
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
 
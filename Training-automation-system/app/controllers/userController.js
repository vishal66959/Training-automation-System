import nodemailer from "nodemailer";
import request from "superagent";
import { createConnection, getConnection} from "typeorm";

import { AuthenticationError } from "../errors";
import Responder from "../../lib/expressResponder";
import logger from "../../lib/logger";
import { Employee } from "../models/Employee";
import config from "../../config/development";


export default class UserController {
  static dashboard(req, res) {
    if (req.session.employee) {
      res.cookie("token", req.session.employee.accessToken);
      if (req.session.employee.designation === "admin") {
        Responder.render(res, "adminLogin", req.session.msg);
      }
      if (req.session.employee.designation === "hr") {
        Responder.render(res, "hrLogin", req.session.msg);
      } else {
        Responder.render(res, "adminLogin", req.session.msg);
      }
    } else {
      res.cookie("token", "");
      Responder.operationFailed(
        res,
        new AuthenticationError("Please Login First")
      );
    }
  }

  static logout(req, res) {
    req.session.destroy(function() {
      logger.info("user logged out.");
    });
    Responder.redirect(res, "/home");
  }

  static email(req, res) {
    if (req.session.employee) {
      // const { google } = require("googleapis");
      // const OAuth2 = google.auth.OAuth2;
      const clientId = config.clientId;
      const clientKey = config.clientKey;
      console.log(clientId);
      console.log(clientKey);
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
      let trainees, recieversArray;
      const auth = {
        type: "OAuth2",
        user: req.session.employee.email,
        clientId: clientId,
        clientSecret: clientKey,
        refreshToken: req.session.employee.refreshToken,
        accessToken: req.session.accessToken
      };

      console.log(auth);
      console.log(
        "######################################################################"
      );
      const smtpTransport = nodemailer.createTransport({
        service: "gmail",
        auth: auth
      });
      console.log("this is transporter", smtpTransport, "=================\n");

      // createConnection().then(async connection => {
      //   trainees = await getConnection()
      //   .createQueryBuilder(Schedule, "shcedule")
      //     .leftJoinAndSelect("schedule.Trainee", "trainees")
      //     .where("schedule.scheduleId = :id", {
      //       id: req.body.schedule.scheduleId
      //     })
      //     .getMany();

      // await connection.close();

      // for (emp of trainees) {
      //   recieversArray.push(emp.email);
      // }
      // req.session.employee.email

      const mailOptions = {
        from: req.session.employee.email,
        to: "jaiswalvishal959@gmail.com",
        subject: "Node.js Email with Secure OAuth",
        generateTextFromHTML: true,
        html: "<b>test this is the fucking test for you bc</b>"
      };

      smtpTransport.verify(function(error, success) {
        if (error) {
          console.log(error, "this is error");
        } else {
          console.log("Server is ready to take our messages", success);
        }
      });

      smtpTransport.sendMail(mailOptions, (error, response) => {
        if (error) {
          logger.info(error);
          Responder.operationFailed(res, error);
        } else {
          logger.info(response);
          Responder.success(res, response);
        }
        smtpTransport.close();
      });
      // });
    } else {
      res.cookie("token", "");
      Responder.operationFailed(
        res,
        new AuthenticationError("Please Login First")
      );
    }
  }

  static refreshToken(req, res) {
    const clientId = config.clientId;
    const clientKey = config.clientKey;

    if (req.session.employee) {
      const bodyToSend = {
        client_id: clientId,
        client_secret: clientKey,
        refresh_token: req.session.employee.refreshToken,
        grant_type: "refresh_token"
      };
      logger.info(bodyToSend);
      request
        .post(config.authLink)
        .set("Content-Type", "application/x-www-form-urlencoded")
        .send(bodyToSend)
        .end(function(err, response) {
          logger.info(
            JSON.parse(response.text)["access_token"],
            "----------------------"
          );
          req.session.employee.accessToken = JSON.parse(response.text)[
            "access_token"
          ];
          createConnection()
            .then(async connection => {
              await getConnection()
                .createQueryBuilder()
                .update(Employee)
                .set({ accessToken: JSON.parse(response.text)["access_token"] })
                .where("employeeId = :id", {
                  id: req.session.employee.employeeId
                })
                .execute();
              await connection.close();
            })
            .catch(error => logger.info(error));
          Responder.redirect(res, "/user/dashboard");
        });
    } else {
      res.cookie("token", "");
      Responder.operationFailed(
        res,
        new AuthenticationError("Please Login First")
      );
    }
  }
}

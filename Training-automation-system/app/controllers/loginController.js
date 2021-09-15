import { createConnection, getConnection } from "typeorm";

import { Employee } from "../models/Employee";
import config from "../../config/development";
import logger from "../../lib/logger";
import Responder from "../../lib/expressResponder";
import { AuthenticationError, ServiceUnavailableError } from "../errors";
import Request from "../../lib/request";

const request = new Request("", "");
const clientId = config.clientId;
const clientKey = config.clientKey;
const redirectUri = config.redirectUri;

export default class LoginController {
  static login(req, res) {
    Responder.redirect(res, config.url);
  }

  static gmail(req, res) {
    let textData;
    let access_token, msg, bodyText, refresh_token;
    let code = req.query.code;
    let scope = req.query.scope;
    let bodyToSend =
      "code=" +
      code +
      "&client_id=" +
      clientId +
      "&client_secret=" +
      clientKey +
      "&grant_type=authorization_code&redirect_uri=" +
      redirectUri;
    request
      .post(config.authLink, bodyToSend, "", {
        "Content-Type": "application/x-www-form-urlencoded"
      })
      .then(
        response => {
          bodyText = JSON.parse(response.text);
          access_token = bodyText["access_token"];
          refresh_token = bodyText["refresh_token"];
          logger.info(
            "\n\n",
            access_token,
            "\n\nthis is access tokent ==================="
          );
          request.get(config.tokenLink + access_token).then(
            response => {
              textData = JSON.parse(response.text);
              if (
                textData.domain === "techracers.io" ||
                textData.domain === "decode.com"
              ) {
                let employee;
                createConnection()
                  .then(async connection => {
                    logger.info("connectioon prinitnng \n",connection,"\nif printerd \n ")
                    logger.info("connection created and now rest of the shit ");
                    employee = await getConnection()
                      .createQueryBuilder()
                      .select("emp")
                      .from(Employee, "emp")
                      .where("emp.email = :email", {
                        email: textData.emails[0].value
                      })
                      .getOne();
                    logger.info(
                      "First Employee information \n\n",
                      employee,
                      "\n\n"
                    );
                    if (employee == undefined) {
                      employee = new Employee();
                      employee.firstName = textData.name.givenName;
                      employee.lastName = textData.name.familyName;
                      employee.email = textData.emails[0].value;
                      employee.accessToken = access_token;
                      employee.refreshToken = refresh_token;
                      await connection.manager.save(employee);
                      msg = "Welcome new employee \n";
                    } else {
                      employee.accessToken = access_token;
                      await connection.manager.save(employee);
                      msg = "Welcome old employee \n";
                    }
                    req.session.employee = employee;
                    req.session.accessToken = access_token;
                    logger.info(
                      "Seccond request Employee information \n\n",
                      req.session.employee,
                      "\n\n"
                    );
                    // req.session.employee.accessToken = access_token;
                    logger.info(
                      "Seccond Employee information \n\n",
                      employee,
                      "\n\n"
                    );
                    req.session.msg =
                      msg + JSON.stringify(req.session.employee);
                    Responder.redirect(res, "/user/dashboard");
                    await connection.close();
                  })
                  .catch(error => {
                    logger.info(error);
                    Responder.operationFailed(
                      res,
                      new ServiceUnavailableError("Database Problem")
                    );
                  });
              } else {
                Responder.operationFailed(
                  res,
                  new AuthenticationError(
                    "Not an Employee of Techracers/Deqode"
                  )
                );
              }
            },
            error => {
              logger.info(error);
            }
          );
        },
        error => {
          logger.info(error); 
        }
      );
  }
}

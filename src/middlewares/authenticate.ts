import { Request, Response, NextFunction } from "express";
import getResponseTemplate, { IResponse } from "../lib/responseTemplate.js";
import { checkToken } from "../servicing/authService.js";

export function authenticate(access: boolean = false) {
  return async (req: Request, res: Response<IResponse>, next: NextFunction) => {
    try {
      let message: string;
      const response = getResponseTemplate();

      const bearer: string = req.headers.authorization || "";
      const token: string = bearer.split(" ")[1];
      const user = await checkToken(token);

      if (user) {
        // токен есть, актуальный, user найден
        req.body = { ...req.body, forUser: user }; // доп.
        // body будет типизироваться в validate.ts

        if (access) {
          // доступ к действиям, определяется путем url, поэтому проверка админа обязательна

          if (user.status === "admin") {
            next();
            return;
          }

          message = "403 Forbidden"; // прав на действия нет
          response.error = {
            message
          };
          return res.status(403).json(response);
        } else {
          next();
          return;
        }
      }

      message = "401 Unauthorized";
      response.error = {
        message
      };
      return res.status(401).json(response);
    } catch (err) {
      const message: string = "500 Server Error";
      const response = getResponseTemplate();
      response.error = {
        message
      };
      return res.status(500).json(response);
    }
  };
}

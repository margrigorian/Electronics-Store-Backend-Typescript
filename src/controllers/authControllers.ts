import { Request, Response } from "express";
import getResponseTemplate, { IResponse } from "../lib/responseTemplate.js";
import { checkUser, addNewUser, getToken } from "../servicing/authService.js";

export async function userRegistrationController(req: Request, res: Response<IResponse>) {
  try {
    let message: string;
    const response = getResponseTemplate();

    const { username, email, password } = req.body;
    const user = await checkUser(email, password);

    if (user === null) {
      const newUser = await addNewUser(username, email, password);
      message = "Successful registration! Please login"; // для получения токена и дальнейших действий
      response.data = {
        message,
        newUser
      };
      return res.status(201).json(response);
    }

    message = "User login already exists";
    response.error = {
      message
    };
    return res.status(406).json(response);
  } catch (err) {
    const message: string = "500 Server Error";
    const response = getResponseTemplate();
    response.error = {
      message
    };
    return res.status(500).json(response);
  }
}

export async function userLoginController(req: Request, res: Response<IResponse>) {
  try {
    let message: string;
    const response = getResponseTemplate();

    const { email, password } = req.body;
    const user = await checkUser(email, password);

    if (user) {
      // авторизация прошла успешно, выдаем токен
      const token = getToken(email);
      message = "Successful authorization! You can continue your session";
      response.data = {
        message,
        user: { ...user, token }
      };
      return res.status(201).json(response);
    }

    message = "The user's email address or passward is invalid";
    response.error = {
      message
    };
    return res.status(406).json(response);
  } catch (err) {
    const message: string = "500 Server Error";
    const response = getResponseTemplate();
    response.error = {
      message
    };
    return res.status(500).json(response);
  }
}

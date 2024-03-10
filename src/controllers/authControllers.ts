import { Request, Response } from "express";
import getResponseTemplate, { IResponse } from "../lib/responseTemplate.js";
import { checkUser, addNewUser } from "../servicing/authService.js";

export async function userRegistrationController(req: Request, res: Response<IResponse>) {
  try {
    let message;
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
    const message = "500 Server Error";
    const response = getResponseTemplate();
    response.error = {
      message
    };
    return res.status(500).json(response);
  }
}

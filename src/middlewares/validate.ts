import { Request, Response, NextFunction } from "express";
import z from "zod";
import getResponseTemplate, { IResponse } from "../lib/responseTemplate.js";

export function validate(action: string) {
  return (req: Request, res: Response<IResponse>, next: NextFunction) => {
    interface SchemaMap {
      [action: string]: z.ZodSchema; // Dynamic property names with string keys for actions
    }

    const schemas: SchemaMap = {
      registration: z.object({
        username: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(5)
      })
    };

    const validatedData = schemas[action].safeParse(req.body);

    if (validatedData.success) {
      next();
      return;
    }

    const message = "The sent data is incorrect";
    const response = getResponseTemplate();
    response.error = {
      message
    };

    return res.status(406).json(response);
  };
}

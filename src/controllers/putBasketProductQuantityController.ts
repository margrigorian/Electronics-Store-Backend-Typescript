import { Request, Response } from "express";
import getResponseTemplate, { IResponse } from "../lib/responseTemplate.js";
import { updateBasketProductQuantity } from "../db/slices/basket.js";

export async function putBasketProductQuantityController(req: Request, res: Response<IResponse>) {
  try {
    const { productId, quantity, forUser } = req.body;
    const response = getResponseTemplate();

    const data = await updateBasketProductQuantity(productId, quantity, forUser.id);

    if (data) {
      response.data = {
        data
      };
      return res.status(201).json(response);
    }

    const message: string = "400 Bad Request"; // в случае неверного id или несоответствия кол-ва товара
    response.error = {
      message
    };
    return res.status(400).json(response);
  } catch (err) {
    const message: string = "500 Server Error";
    const response = getResponseTemplate();
    response.error = {
      message
    };
    return res.status(500).json(response);
  }
}

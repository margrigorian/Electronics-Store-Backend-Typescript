import { Request, Response } from "express";
import getResponseTemplate, { IResponse } from "../lib/responseTemplate.js";
import { getProduct } from "../db/slices/products.js";

export async function productController(req: Request, res: Response<IResponse>) {
  try {
    const { productId } = req.body; // добавлено из params во время middleware validated, будет string
    const data = await getProduct(+productId);

    const response = getResponseTemplate();

    if (data) {
      response.data = {
        data
      };
      return res.status(200).json(response);
    }

    const message: string = "The product not found"; // в случае неверного id продукта
    response.error = {
      message
    };
    return res.status(404).json(response); // ошибка некорректных данных
  } catch (err) {
    const message: string = "500 Server Error";
    const response = getResponseTemplate();
    response.error = {
      message
    };
    res.status(500).json(response);
  }
}
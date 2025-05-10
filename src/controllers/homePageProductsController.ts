import { Request, Response } from "express";
import { getPopularProducts } from "../db/slices/products.js";
import getResponseTemplate, { IResponse } from "../lib/responseTemplate.js";

export async function homePageProductsController(req: Request, res: Response<IResponse>) {
  try {
    const products = await getPopularProducts();
    const response = getResponseTemplate();

    response.data = {
      data: products
    };
    return res.status(200).json(response);
  } catch (err) {
    const message: string = "500 Server Error";
    const response = getResponseTemplate();
    response.error = {
      message
    };
    return res.status(500).json(response);
  }
}

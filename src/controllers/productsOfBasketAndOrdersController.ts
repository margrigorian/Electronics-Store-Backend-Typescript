import { Request, Response } from "express";
import getResponseTemplate, { IResponse } from "../lib/responseTemplate.js";
import { getProductsFromBasket } from "../db/slices/basket.js";
import { getOrders } from "../db/slices/orders.js";

export async function productsOfBasketAndOrdersController(req: Request, res: Response<IResponse>) {
  try {
    const { forUser } = req.body;
    const response = getResponseTemplate();

    const basket = await getProductsFromBasket(forUser.id);
    const orders = await getOrders(forUser.id, null);

    response.data = {
      basket,
      orders
    };

    return res.status(200).json(response);
  } catch (err) {
    const message: string = "500 Server Error";
    const response = getResponseTemplate();
    response.error = {
      message
    };
    res.status(500).json(response);
  }
}

import { Request, Response } from "express";
import getResponseTemplate, { IResponse } from "../lib/responseTemplate.js";
import { checkExistOfProductInBasket } from "../db/slices/basket.js";
import { deleteProductFromBasket } from "../db/slices/basket.js";

export async function deleteProductFromBasketController(req: Request, res: Response<IResponse>) {
  try {
    const { productId } = req.query;
    const { forUser } = req.body;
    const response = getResponseTemplate();

    if (productId) {
      const productExistenceInBasket = await checkExistOfProductInBasket(+productId, forUser.id);
      if (productExistenceInBasket) {
        // не будет null, так как выше мы проверили наличие продукта в корзине
        const data = await deleteProductFromBasket(+productId, forUser.id);
        response.data = {
          data
        };
        return res.status(200).json(response);
      }
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

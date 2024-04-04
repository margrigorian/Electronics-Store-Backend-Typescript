import { Request, Response } from "express";
import getResponseTemplate, { IResponse } from "../lib/responseTemplate.js";
import { checkProductExistence } from "../db/slices/products.js";
import { postComment, postRate } from "../db/slices/evaluation.js";
import { checkExistOfProductInBasket, getProductOfBasket, addProductToBasket } from "../db/slices/basket.js";
import { IProductComment, IProductRating, IBasketProduct } from "../lib/types.js";

export async function addProductToBasketOrPostCommentAndRateController(req: Request, res: Response<IResponse>) {
  try {
    const { productId, comment, forUser } = req.body;
    const { rate } = req.query;
    const response = getResponseTemplate();

    const product = await checkProductExistence("", +productId);

    if (product) {
      let data: { comment: IProductComment } | { rate: IProductRating } | { product: IBasketProduct } | null;

      if (comment) {
        // post на comment
        data = await postComment(+productId, comment, forUser.id);
      } else if (rate) {
        // post на rate
        data = await postRate(+productId, +rate, forUser.id);
      } else {
        // возможно стоит создать упрощенную функцию проверки и не исп. getBasketProduct?
        const basketProduct = await checkExistOfProductInBasket(+productId);

        if (!basketProduct) {
          // товар еще не добавлен, добавляем
          await addProductToBasket(+productId, forUser.id);
          data = await getProductOfBasket(+productId);
        } else {
          data = null;
        }
      }

      if (data) {
        // продукт существует, добавлен он или комментарий с оценкой
        response.data = {
          data
        };
        return res.status(201).json(response);
      }
    }

    // товара с таким id нет или оценка к продукту уже проставлена, в таком случае post-запрос явл. ошибочным
    const message: string = "400 Bad Request";
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

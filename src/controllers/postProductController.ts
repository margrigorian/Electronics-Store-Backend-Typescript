import { Request, Response } from "express";
import getResponseTemplate, { IResponse } from "../lib/responseTemplate.js";
import { checkProductExistence, postProduct } from "../db/slices/products.js";

export async function postProductController(req: Request, res: Response<IResponse>) {
  try {
    const { title, description, feildOfApplication, category, subcategory, quantity, price } = req.body;
    // пока есть проблемы с загрузкой изображения
    let image = req.file?.path || "";
    if (image) {
      image = image.slice(7);
    }

    const product = await checkProductExistence(title);
    const response = getResponseTemplate();

    if (product === null) {
      // продукт не должен дублироваться
      const data = await postProduct(title, description, image, feildOfApplication, category, subcategory, +quantity, +price);

      response.data = {
        data
      };
      return res.status(201).json(response);
    }

    const message: string = "The product already exists. Change the product title";
    response.error = {
      message
    };
    return res.status(406).json(response); // ошибка некорректных данных
  } catch (err) {
    const message: string = "500 Server Error";
    const response = getResponseTemplate();
    response.error = {
      message
    };
    return res.status(500).json(response);
  }
}

import { Request, Response } from "express";
import getResponseTemplate, { IResponse } from "../lib/responseTemplate.js";
import { getProductList } from "../db/slices/products.js";

export async function productListController(req: Request, res: Response<IResponse>) {
  try {
    // Request<IProductQueriesParams> не помогает, при измнении ключей будет ошибка, они считываются как any

    const { category } = req.params;

    const { subcategory, minPrice, maxPrice, order, page, limit } = req.query; // может быть "", undefined
    // сразу передача в db функцию query-параметров выдаст ошибку из-за типизации
    let productsSubcategory: string;
    let min: number | string;
    let max: number | string;
    let productsOrder: string;
    let pageNumber: number;
    let productsLimit: number;

    // без проверки не работает присваивание, проблема с типизацией
    typeof subcategory === "string" ? (productsSubcategory = subcategory) : (productsSubcategory = "");
    minPrice ? (min = +minPrice) : (min = ""); // преобразование обязательно, так как параметры в db типизируются
    maxPrice ? (max = +maxPrice) : (max = ""); // типизация по-умолчанию req.query сложнее и не подходит
    typeof order === "string" ? (productsOrder = order) : (productsOrder = "");
    page ? (pageNumber = +page) : (pageNumber = 1);
    limit ? (productsLimit = +limit) : (productsLimit = 5); // если отправить в значении string, будет ошибка в запросе products_list (db)

    const data = await getProductList("", category, productsSubcategory, min, max, productsOrder, pageNumber, productsLimit);

    const response = getResponseTemplate();

    if (data) {
      response.data = {
        data
      };
      return res.status(200).json(response);
    }

    const message: string = "404 NOT FOUND"; // список продуктов пуст
    response.error = {
      message
    };
    return res.status(404).json(response);
  } catch (err) {
    const message: string = "500 Server Error";
    const response = getResponseTemplate();
    response.error = {
      message
    };
    res.status(500).json(response);
  }
}

import { Request, Response } from "express";
import getResponseTemplate, { IResponse } from "../lib/responseTemplate.js";
import { getStructureOfProductCategories, getProductList } from "../db/slices/products.js";
import { addAvgRatingAndCommentsToProducts } from "../db/slices/evaluation.js";
import { IProductsWithStructure, ITotalProductsStructure } from "../lib/types.js";

export async function allProductsController(req: Request, res: Response<IResponse>) {
  try {
    const { q, subcategory, minPrice, maxPrice, order, page, limit } = req.query; // может быть "", undefined

    // сразу передача в db функцию query-параметров выдаст ошибку из-за несоответствия типов
    let search: string;
    let productsSubcategory: string;
    let min: number | string;
    let max: number | string;
    let productsOrder: string;
    let pageNumber: number;
    let productsLimit: number;

    typeof q === "string" ? (search = q) : (search = "");
    typeof subcategory === "string" ? (productsSubcategory = subcategory) : (productsSubcategory = "");
    minPrice ? (min = +minPrice) : (min = "");
    maxPrice ? (max = +maxPrice) : (max = "");
    typeof order === "string" ? (productsOrder = order) : (productsOrder = "");
    page ? (pageNumber = +page) : (pageNumber = 1);
    limit ? (productsLimit = +limit) : (productsLimit = 8);

    const response = getResponseTemplate();
    let data: IProductsWithStructure | { structure: ITotalProductsStructure } | null = null;

    const structure = await getStructureOfProductCategories();

    // значит список продуктов не пуст, раз есть структура
    if (structure) {
      const productsList = await getProductList(search, "", productsSubcategory, min, max, productsOrder, pageNumber, productsLimit);
      // получаем productsList с доп. инфорамцией
      // при search может быть null, поэтому необходима проверка
      if (productsList) {
        const productListWithAdditionalInfo = await addAvgRatingAndCommentsToProducts(productsList.products);
        // заменяем изначальный productsList
        productsList.products = productListWithAdditionalInfo.products;

        data = {
          structure,
          ...productsList
        };
      } else {
        data = {
          structure
        };
      }

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

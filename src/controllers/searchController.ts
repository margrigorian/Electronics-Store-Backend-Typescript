import { Request, Response } from "express";
import getResponseTemplate, { IResponse } from "../lib/responseTemplate.js";
import { getProductList } from "../db/slices/products.js";

export async function searchController(req: Request, res: Response<IResponse>) {
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

    // category не передаем, остальное для фильтрации
    const data = await getProductList(search, "", productsSubcategory, min, max, productsOrder, pageNumber, productsLimit);

    const response = getResponseTemplate();

    response.data = {
      data
    };
    return res.status(200).json(response);

    // ПРИ ПУСТОМ ПОИСКЕ НЕ ДОЛЖНО БЫТЬ ОШИБКИ
    // const message: string = "404 NOT FOUND"; // поиск нулевой
    // response.error = {
    //     message
    // };
    // return res.status(404).json(response);
  } catch (err) {
    const message: string = "500 Server Error";
    const response = getResponseTemplate();
    response.error = {
      message
    };
    res.status(500).json(response);
  }
}

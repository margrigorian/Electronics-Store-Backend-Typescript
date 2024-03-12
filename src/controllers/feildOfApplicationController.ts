import { Request, Response } from "express";
import url from "url";
import getResponseTemplate, { IResponse } from "../lib/responseTemplate.js";
import { getFeildOfApplicationCategories } from "../db/slices/products.js";
import { ICategories } from "../lib/types.js";

export async function feildOfApplicationController(req: Request, res: Response<IResponse>) {
  try {
    const reqURL: url.UrlWithParsedQuery = url.parse(req.url, true);
    // frontend в обоих случаях будет отрисовывать весь список категорий продуктов из этой области применения
    let data: { categories: ICategories[] } | null;
    const response = getResponseTemplate();

    if (reqURL.pathname) {
      const feildOfApplication: string[] = reqURL.pathname.split("/"); // область применения продукта ([1])
      data = await getFeildOfApplicationCategories(feildOfApplication[1]);
      // const { category } = req.params; // на front будет "якорем", уточнить использование

      if (data) {
        response.data = {
          data
        };
        return res.status(200).json(response);
      }
    }

    const message: string = "404 NOT FOUND"; // категории не найдены
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

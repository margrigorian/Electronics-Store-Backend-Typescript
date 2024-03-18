import { Request, Response, NextFunction } from "express";
import z from "zod";
import getResponseTemplate, { IResponse } from "../lib/responseTemplate.js";
// import { IProductQueriesParams } from "../lib/types.js";

export function queriesParamsValidate(action: string) {
  return (req: Request, res: Response<IResponse>, next: NextFunction) => {
    try {
      interface SchemaMap {
        [action: string]: z.ZodSchema;
      }

      const schemas: SchemaMap = {
        productListQueries: z.object({
          // .optional предполагает undefined, NaN и null - нет
          subcategory: z.string().optional(),
          // допустила number, "", undefined; в случае NaN случится ошибка (например, при "text")
          minPrice: z.preprocess(a => (a === "" ? a : parseInt(String(a), 10)), z.union([z.number().positive(), z.literal("")])).optional(),
          maxPrice: z.preprocess(a => (a === "" ? a : parseInt(String(a), 10)), z.union([z.number().positive(), z.literal("")])).optional(),
          order: z.union([z.literal("asc"), z.literal("desc"), z.literal("")]).optional(),
          page: z.preprocess(a => (a === "" ? a : parseInt(String(a), 10)), z.union([z.number().positive(), z.literal("")])).optional(),
          limit: z.preprocess(a => (a === "" ? a : parseInt(String(a), 10)), z.union([z.number().positive(), z.literal("")])).optional()
          // лишние query-параметры не препятсвуют запросу
        }),
        searchQueries: z.object({
          q: z.string().optional(),
          subcategory: z.string().optional(),
          // допустила number, "", undefined; в случае NaN случится ошибка (например, при "text")
          minPrice: z.preprocess(a => (a === "" ? a : parseInt(String(a), 10)), z.union([z.number().positive(), z.literal("")])).optional(),
          maxPrice: z.preprocess(a => (a === "" ? a : parseInt(String(a), 10)), z.union([z.number().positive(), z.literal("")])).optional(),
          order: z.union([z.literal("asc"), z.literal("desc"), z.literal("")]).optional(),
          page: z.preprocess(a => (a === "" ? a : parseInt(String(a), 10)), z.union([z.number().positive(), z.literal("")])).optional(),
          limit: z.preprocess(a => (a === "" ? a : parseInt(String(a), 10)), z.union([z.number().positive(), z.literal("")])).optional()
        }),
        productIdParam: z.object({
          productId: z.preprocess(a => parseInt(String(a), 10), z.number().positive()) // проверка id из params
        }),
        rateQuery: z.object({
          productId: z.preprocess(a => parseInt(String(a), 10), z.number().positive()), // проверка id из params
          rate: z.preprocess(a => parseInt(String(a), 10), z.number().min(1).max(5)).optional()
        })
      };

      let queryParams; // оставляем any, так как типизация будет проходить через zod

      if (req.params.id) {
        const { id } = req.params; // для getProductController и postCommentController
        req.body = { ...req.body, productId: id };
        queryParams = { ...req.query, productId: id };
      } else {
        queryParams = req.query;
      }

      // НЕ ТИПИЗИРУЕТСЯ data, КАК ПРАВИЛЬНО?
      // type ParseSchema = typeof schemas; // не создает прототип с ключами, придется все из schemas прописывать в SchemaMap
      // type SafeParseResult<T extends keyof ParseSchema> = { success: false; error: { message: string } } | { success: true; data: z.infer<ParseSchema[T]> };
      // const validatedData: SafeParseResult<string> = schemas[action].safeParse(queryParams);

      const validatedData = schemas[action].safeParse(queryParams);

      if (validatedData.success) {
        const data = validatedData.data;
        // присуждение не получится (см. ниже), так как либо типы ключей будут распозноваться как any,
        // либо случае типизации validatedData.data: IProductQueriesParams будет ошибка - у req.query свои встроенные типы
        // req.query = data;
        const min: number | string | undefined = data.minPrice;
        const max: number | string | undefined = data.maxPrice;

        // допускается undefined/"" и верное мат. сравнение
        if (!min || !max || min < max) {
          next();
          return;
        }
      }

      const message: string = "The sent data is incorrect";
      const response = getResponseTemplate();
      response.error = {
        message
      };

      return res.status(406).json(response);
    } catch (err) {
      const message: string = "500 Server Error";
      const response = getResponseTemplate();
      response.error = {
        message
      };
      return res.status(500).json(response);
    }
  };
}

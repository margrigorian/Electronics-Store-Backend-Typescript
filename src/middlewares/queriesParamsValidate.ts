import { Request, Response, NextFunction } from "express";
import z from "zod";
import getResponseTemplate, { IResponse } from "../lib/responseTemplate.js";
// import { IProductQueriesParams } from "../lib/types.js";

export function queriesParamsValidate(action: string) {
  return (req: Request, res: Response<IResponse>, next: NextFunction) => {
    interface SchemaMap {
      [action: string]: z.ZodSchema;
    }

    const schemas: SchemaMap = {
      productListQueries: z.object({
        // .optional предполпгает undefined, NaN и null - нет
        category: z.string().optional(),
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
      })
    };

    let queryParams; // оставляем any, так как типизация будет проходить через zod

    // чтобы не использовать типизацию через Request<{category : string | undefined}>
    if (req.params) {
      const { category } = req.params; // всегда string, только при наличии req.params сработает router
      queryParams = { ...req.query, category };
    } else {
      queryParams = req.query;
    }

    // при других случаях валидации category будет игнорироваться в schemas
    // const queryParams: IProductQueriesParams = { ...req.query, category };

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
  };
}

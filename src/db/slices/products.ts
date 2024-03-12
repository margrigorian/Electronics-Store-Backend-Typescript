import db from "../db.js";
import { FieldPacket, RowDataPacket } from "mysql2/promise";
import { ICategory, ICategoryProduct, ICategories } from "../../lib/types.js";

const url: string = "http://localhost:3001/images/";

export async function getFeildOfApplicationCategories(feildOfApplication: string): Promise<{ categories: ICategories[] } | null> {
  // определяем категории продуктов, относящиеся к указанной области применения
  const categories_list: [(RowDataPacket & ICategory)[], FieldPacket[]] = await db.query(
    `
        SELECT category FROM products WHERE feildOfApplication = "${feildOfApplication}" 
        GROUP BY category
    `
  );

  if (categories_list[0].length > 0) {
    // запрашиваем продукты указанных категорий, на выходе - массивы промисов
    const promise_products_list: Promise<ICategoryProduct[]>[] = categories_list[0].map(async el => {
      const products: [(RowDataPacket & ICategoryProduct)[], FieldPacket[]] = await db.query(
        `SELECT id, title, image, price FROM products WHERE category = "${el.category}" LIMIT 3`
      );
      // корректируем url изображения

      const edited_products: ICategoryProduct[] = products[0].map(el => {
        el.image = url + el.image;
        return el;
      });

      return edited_products;
    });

    const products_list: ICategoryProduct[][] = await Promise.all(promise_products_list).then(list => list);

    const categories: ICategories[] = categories_list[0].map((el, i) => {
      return { category: el.category, products: products_list[i] }; // формируем необходимую структуру
    });

    return {
      categories
    };
  } else {
    return null;
  }
}

import db from "../db.js";
import { FieldPacket, RowDataPacket } from "mysql2/promise";
import { getAvgRating, getCommentsWithRates, getRates } from "./evaluation.js";
import {
  IFeildOfApplicationStructure,
  ICategoriesStructure,
  ISubategoriesStructure,
  ITotalProductsStructure,
  ICategory,
  ICategoryProduct,
  ICategories,
  IProduct,
  IProductWithRate,
  IProductListInfo,
  IProductWithCommentsAndRates
} from "../../lib/types.js";

const url: string = "http://localhost:3001/images/";

// FOR ADMIN
export async function getStructureOfProductCategories(): Promise<ITotalProductsStructure | null> {
  const feildsOfApplication: [(RowDataPacket & IFeildOfApplicationStructure)[], FieldPacket[]] = await db.query(
    `SELECT DISTINCT feildOfApplication FROM products`
  );

  if (feildsOfApplication[0].length > 0) {
    const categories: [(RowDataPacket & ICategoriesStructure)[], FieldPacket[]] = await db.query(
      `SELECT category, feildOfApplication AS fromFeildOfApplication FROM products GROUP BY category, feildOfApplication`
    );
    const subcategories: [(RowDataPacket & ISubategoriesStructure)[], FieldPacket[]] = await db.query(
      `SELECT subcategory, category AS fromCategory FROM products GROUP BY subcategory, category`
    );

    return {
      feildsOfApplication: feildsOfApplication[0],
      categories: categories[0],
      subcategories: subcategories[0]
    };
  }

  return null;
}

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

export async function getProductList(
  search: string,
  category: string,
  subcategory: string,
  minPrice: number | string,
  maxPrice: number | string,
  order: string,
  page: number,
  limit: number
): Promise<IProductListInfo | null> {
  const filters: (string | number)[] = [];
  const params: (string | number)[] = [];

  if (search) {
    filters.push("title LIKE ?");
    params.push(`%${search}%`);
  }

  if (category) {
    filters.push("category = ?");
    params.push(category);
  }

  if (subcategory) {
    filters.push("subcategory = ?");
    params.push(subcategory);
  }

  // SUBCATEGORIES для фильтрации на фронте
  let subcategories_list: [(RowDataPacket & { subcategory: string })[], FieldPacket[]];

  if (category) {
    // при product-list
    subcategories_list = await db.query(`SELECT DISTINCT subcategory FROM products WHERE category = "${category}"`);
  } else {
    // при search
    subcategories_list = await db.query(`SELECT DISTINCT subcategory FROM products WHERE title LIKE "%${search}%"`);
  }
  const subcategories: string[] = subcategories_list[0].map(el => el.subcategory);
  // если subcategory "other" есть и она не находится в конце массива, переносим ее туда
  if (subcategories.indexOf("other") !== -1 && subcategories.indexOf("other") !== subcategories.length - 1) {
    subcategories.splice(subcategories.indexOf("other"), 1);
    subcategories.push("other");
  }

  // РАНЖИРОВАНИЕ ЦЕНЫ
  filters.push("price BETWEEN ? AND ?");
  const priceFilter: string[] = [];
  const priceParam: string[] = [];

  if (search) {
    priceFilter.push("title LIKE ?");
    priceParam.push(`%${search}%`);
  }

  if (subcategory) {
    priceFilter.push("subcategory = ?");
    priceParam.push(subcategory);
  } else if (category) {
    priceFilter.push("category = ?");
    priceParam.push(category);
  }

  const priceValues: [(RowDataPacket & { max: number; min: number })[], FieldPacket[]] = await db.query(
    `
          SELECT CEIL(MAX(price)) AS max, FLOOR(MIN(price)) AS min FROM products
          ${priceFilter.length > 0 ? `WHERE ${priceFilter.join(" AND ")}` : ""}
      `,
    priceParam
  );

  if (minPrice && !maxPrice) {
    params.push(minPrice, priceValues[0][0].max);
  } else if (!minPrice && maxPrice) {
    params.push(priceValues[0][0].min, maxPrice);
  } else if (minPrice && maxPrice) {
    params.push(minPrice, maxPrice);
  } else {
    params.push(priceValues[0][0].min, priceValues[0][0].max);
  }

  // ПАГИНАЦИЯ
  params.push((page - 1) * limit, limit);

  // без category в select выдает ошибку, так как атрибут исп. в фильтрах
  const products_list: [(RowDataPacket & IProductWithRate)[], FieldPacket[]] = await db.query(
    `
          SELECT id, title, description, image, price, quantity, AVG(rate) AS rate, feildOfApplication, category, subcategory FROM products 
          LEFT JOIN product_rating ON products.id = product_rating.product_id
          GROUP BY id
          HAVING ${filters.join(" AND ")}
          ${order ? `ORDER BY price ${order === "asc" ? "asc" : "desc"}` : ""}
          LIMIT ?, ?
      `,
    params
  );

  // COUNT срабатывает неточно, приходится дублировать для получения общего кол-ва товаров
  const productsQuantity: [(RowDataPacket & { title: string })[], FieldPacket[]] = await db.query(
    `SELECT title FROM products WHERE ${filters.join(" AND ")}`,
    params
  );

  if (products_list[0].length > 0) {
    // Корректна ли проверка? Возможна ли ошибка priceValues при пустом списке?

    const products: IProductWithRate[] = products_list[0].map(el => {
      el.image = url + el.image;
      return el;
    });

    return {
      products,
      subcategories,
      priceMin: priceValues[0][0].min,
      priceMax: priceValues[0][0].max,
      length: productsQuantity[0].length
    };
  } else {
    return null;
  }
}

export async function getProduct(id: number): Promise<{ product: IProductWithCommentsAndRates } | null> {
  const data: [(RowDataPacket & IProduct)[], FieldPacket[]] = await db.query(`SELECT * FROM products WHERE id = "${id}"`);
  // console.log(typeof data[0][0].quantity);
  if (data[0].length > 0) {
    // товар с указанным id найден
    const currentProduct = data[0][0];
    // коректируем путь к изображению
    currentProduct.image = url + currentProduct.image;

    const avgRating = await getAvgRating(id);
    const comments = await getCommentsWithRates(id);
    const rates = await getRates(id);
    const product = { ...currentProduct, avgRating, comments, rates };

    return {
      product
    };
  } else {
    return null;
  }
}

export async function checkProductExistence(title: string): Promise<{ product: IProduct } | null> {
  const product: [(RowDataPacket & IProduct)[], FieldPacket[]] = await db.query(`SELECT * FROM products WHERE title = ?`, [title]);

  if (product[0][0]) {
    return {
      product: product[0][0]
    };
  } else {
    return null;
  }
}

export async function postProduct(
  title: string,
  description: string,
  image: string,
  feild: string,
  category: string,
  sub: string,
  quantity: number,
  price: number
) {
  let id = await getLastProductId();

  if (id) {
    id = id + 1;
  } else {
    id = 1; // самый первый продукт
  }

  await db.query(
    `
          INSERT INTO products(id, title, description, image, feildOfApplication, category, subcategory, quantity, price) 
          VALUES("${id}", ?, ?, "${image}", "${feild}", "${category}", "${sub}", "${quantity}", "${price}")
      `,
    [title, description]
  );

  const product = await getProduct(id);
  return product;
}

async function getLastProductId(): Promise<number | null> {
  const lastId: [(RowDataPacket & { id: number })[], FieldPacket[]] = await db.query("SELECT id FROM products ORDER BY id DESC LIMIT 1");

  if (lastId[0][0]) {
    return lastId[0][0].id;
  }

  return null; // записей еще нет
}

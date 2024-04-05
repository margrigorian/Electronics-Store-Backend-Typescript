import db from "../db.js";
import { FieldPacket, RowDataPacket } from "mysql2/promise";
import { IBasketProduct } from "../../lib/types.js";
import { getProduct } from "./products.js";

export async function checkExistOfProductInBasket(productId: number, userId: number): Promise<boolean> {
  const data: [(RowDataPacket & { product_id: number })[], FieldPacket[]] = await db.query(
    `SELECT * FROM basket WHERE product_id = "${productId}" AND user_id = "${userId}"`
  );

  if (data[0][0]) {
    return true;
  } else {
    return false;
  }
}

export async function getProductOfBasket(productId: number): Promise<{ product: IBasketProduct } | null> {
  const data: [(RowDataPacket & IBasketProduct)[], FieldPacket[]] = await db.query(
    `
        SELECT p.id AS id, p.title AS title, p.image AS image, b.quantity AS quantity, p.price AS price FROM products AS p
        LEFT JOIN basket AS b ON p.id = b.product_id
        WHERE p.id = "${productId}"
    `
  );

  if (data[0][0]) {
    return {
      product: data[0][0]
    };
  } else {
    return null;
  }
}

export async function getProductsFromBasket(userId: number): Promise<IBasketProduct[]> {
  const data: [(RowDataPacket & IBasketProduct)[], FieldPacket[]] = await db.query(
    `
        SELECT p.id AS id, p.title AS title, p.image AS image, b.quantity AS quantity, p.price AS price FROM products AS p
        LEFT JOIN basket AS b ON p.id = b.product_id
        WHERE b.user_id = "${userId}"
    `
  );

  return data[0];
}

export async function addProductToBasket(productId: number, userId: number): Promise<{ product: IBasketProduct } | null> {
  await db.query(
    `
        INSERT INTO basket(product_id, quantity, user_id)
        VALUES("${productId}", "${1}", "${userId}")
    `
  );

  const product = await getProductOfBasket(productId);
  return product;
}

export async function updateBasketProductQuantity(productId: number, quantity: number, userId: number): Promise<{ product: IBasketProduct } | null> {
  const productExistenceInBasket = await checkExistOfProductInBasket(productId, userId);

  // товар присутствует в basket
  if (productExistenceInBasket) {
    const productInfo = await getProduct(productId);
    // количество запрашиваемого товара соответстует имеющемуся "на складе"
    if (productInfo && productInfo.product.quantity >= quantity) {
      await db.query(
        `UPDATE basket SET quantity = "${quantity}" 
        WHERE product_id = "${productId}" AND user_id = "${userId}"`
      );
      const product = await getProductOfBasket(productId);
      return product;
    }
  }

  return null;
}

export async function deleteProductFromBasket(productId: number): Promise<{ product: IBasketProduct } | null> {
  const product = await getProductOfBasket(productId);
  await db.query(`DELETE FROM basket WHERE product_id = "${productId}"`);
  return product;
}

import db from "../db.js";
import { FieldPacket, RowDataPacket } from "mysql2/promise";
import { getProduct, updateProduct } from "./products.js";
import { checkExistOfProductInBasket, deleteProductFromBasket } from "./basket.js";
import { IUserOrderedProduct, IConfirmedOrderedProduct } from "../../lib/types.js";

export async function getOrders(userId: number, orderId: number | null): Promise<IConfirmedOrderedProduct[]> {
  let orderingCondition: string = "";
  if (orderId) {
    orderingCondition = `AND order_id = ${orderId}`;
  }

  const data: [(RowDataPacket & IConfirmedOrderedProduct)[], FieldPacket[]] = await db.query(
    `
      SELECT * FROM orders WHERE user_id = ${userId} ${orderingCondition}
    `
  );

  return data[0];
}

export async function postOrder(userOrder: IUserOrderedProduct[], userId: number): Promise<{ order: IConfirmedOrderedProduct[] }> {
  // проверка наличия заказанных товаров

  const orderedProducts = userOrder.map(async el => {
    const productInfo = await getProduct(el.productId); // продукт есть и его количество > 0
    const productExistence = await checkExistOfProductInBasket(el.productId, userId); // user добавлял продукт в корзину

    if (productInfo && productInfo.product.quantity > 0 && productExistence) {
      // товар есть и его общее количество на "складе" > 0
      const product = productInfo.product;

      // кол-во заказанного товара соответствует имеющемуся кол-ву на "складе"
      if (el.quantity <= product.quantity) {
        const quantity = product.quantity - el.quantity;
        // обновляем количество оставшегося товара в базе

        await updateProduct(product.id, "", "", "", "", "", "", quantity, "");
        await deleteProductFromBasket(product.id, userId);

        // заменила общее количество на заказанное юзером, чтобы легче выстраивать объекты order ниже
        product.quantity = el.quantity;
        return product;
      }

      return null;
    }

    return null;
  });

  let confirmedOrderedProducts = await Promise.all(orderedProducts).then(result => result);
  // убираем null значения и оставляем продукты с количеством > 0
  confirmedOrderedProducts = confirmedOrderedProducts.filter(item => item);

  let order: IConfirmedOrderedProduct[] = [];

  if (confirmedOrderedProducts.length > 0) {
    // заказанные продукты существуют
    const orderId = await getOrderId(userId);

    const expression: string[] = [];
    const params: (string | number)[] = [];

    confirmedOrderedProducts.forEach(async el => {
      if (el) {
        //требует типизация
        expression.push("(?, ?, ?, ?, ?, ?, ?)");

        params.push(orderId);
        params.push(el.id);
        params.push(el.title);
        params.push(el.image);
        params.push(el.price);
        params.push(el.quantity);
        params.push(userId);
      }
    });

    // множественный insert в таблицу order
    await db.query(
      `
        INSERT INTO orders(order_id, product_id, product_title, product_image, product_price, quantity, user_id)
        VALUES ${expression.join(",")}
      `,
      params
    );

    order = await getOrders(userId, orderId);
  }

  return {
    order
  };
}

async function getOrderId(userId: number): Promise<number> {
  const lastOrderId: [(RowDataPacket & { order_id: number })[], FieldPacket[]] = await db.query(
    `SELECT order_id FROM orders WHERE user_id = "${userId}" ORDER BY order_id DESC LIMIT 1 `
  );

  let id: number;

  if (lastOrderId[0][0]) {
    id = lastOrderId[0][0].order_id + 1;
    return id;
  } else {
    id = 1; // самый первый заказ
    return id;
  }
}

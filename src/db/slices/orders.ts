import db from "../db.js";
import { FieldPacket, RowDataPacket } from "mysql2/promise";
import { getProduct, updateProduct } from "./products.js";
import { IUserOrderedProduct, IConfirmedOrderedProduct } from "../../lib/types.js";

export async function postOrder(userOrder: IUserOrderedProduct[], userId: number) {
  // проверка наличия заказанных товаров
  const orderedProducts = userOrder.map(async (el, i) => {
    const productInfo = await getProduct(el.productId);

    if (productInfo && productInfo.product.quantity > 0) {
      // товар есть и его общее количество на "складе" > 0
      const product = productInfo.product;

      // кол-во заказанного товара соответствует имеющемуся кол-ву на "складе"
      if (userOrder[i].quantity <= product.quantity) {
        const quantity = product.quantity - userOrder[i].quantity;
        // обновляем количество оставшегося товара в базе
        await updateProduct(product.id, "", "", "", "", "", "", quantity, "");
        // заменила общее количество на заказанное юзером, чтобы легче выстраивать объекты order ниже
        product.quantity = userOrder[i].quantity;
        return product;
      }

      return null;
    }

    return null;
  });

  let confirmedOrderedProducts = await Promise.all(orderedProducts).then(result => result);
  // убираем null значения и оставляем продукты с количеством > 0
  confirmedOrderedProducts = confirmedOrderedProducts.filter(item => item);

  const orderIdArr: number[] = []; // для запросов к таблице order
  let order: IConfirmedOrderedProduct[] = [];

  if (confirmedOrderedProducts.length > 0) {
    // заказанные продукты существуют
    let orderId = await getOrderId();
    const params: (string | number)[] = [];
    const expression: string[] = [];

    confirmedOrderedProducts.forEach(async el => {
      if (el) {
        //требует типизация
        expression.push("(?, ?, ?, ?, ?, ?)");

        params.push(orderId);
        params.push(el.id);
        params.push(el.title);
        params.push(el.price);
        params.push(el.quantity);
        params.push(userId);

        orderIdArr.push(orderId);
        orderId += 1;
      }
    });

    // множественный insert в таблицу order
    await db.query(
      `
                INSERT INTO orders(order_id, product_id, product_title, product_price, quantity, user_id)
                VALUES ${expression.join(",")}
            `,
      params
    );

    // запрашиваем информацию о заказах из таблицы order
    const orderArr = orderIdArr.map(async id => {
      const product = await getOrderedProduct(id);
      return product;
    });

    order = await Promise.all(orderArr).then(orders => orders); // результирующий массив заказанных продуктов
  }

  return {
    order
  };
}

async function getOrderId(): Promise<number> {
  const lastOrderId: [(RowDataPacket & { order_id: number })[], FieldPacket[]] = await db.query(
    "SELECT order_id FROM orders ORDER BY order_id DESC LIMIT 1"
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

async function getOrderedProduct(orderId: number): Promise<IConfirmedOrderedProduct> {
  const orderedProduct: [(RowDataPacket & IConfirmedOrderedProduct)[], FieldPacket[]] = await db.query(
    `SELECT * FROM orders WHERE order_id = "${orderId}"`
  );
  return orderedProduct[0][0];
}

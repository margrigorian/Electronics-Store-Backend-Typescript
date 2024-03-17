import db from "../db.js";
import { FieldPacket, RowDataPacket } from "mysql2/promise";
import { ICommentsWithRates, IRates } from "../../lib/types.js";

export async function getAvgRating(id: number): Promise<number | null> {
  const avgRating: [(RowDataPacket & { rate: string })[], FieldPacket[]] = await db.query(
    `SELECT AVG(rate) AS rate FROM product_rating WHERE product_id = "${id}"`
  );

  let rate: number | null;

  if (avgRating[0][0].rate) {
    // оценки присутствуют
    rate = +avgRating[0][0].rate;
  } else {
    rate = null;
  }

  return rate;
}

// используется в getProduct
export async function getCommentsWithRates(id: number): Promise<ICommentsWithRates[]> {
  const comments: [(RowDataPacket & ICommentsWithRates)[], FieldPacket[]] = await db.query(
    `
            SELECT c.comment_id, c.comment, r.rate, c.user_id, u.username FROM product_comments c
            INNER JOIN users u ON c.user_id = u.id
            LEFT JOIN product_rating r ON c.user_id = r.user_id AND c.product_id = r.product_id
            WHERE c.product_id = "${id}"
        `
  );

  return comments[0];
}

export async function getRates(id: number): Promise<IRates[]> {
  const rates: [(RowDataPacket & IRates)[], FieldPacket[]] = await db.query(`SELECT user_id, rate FROM product_rating WHERE product_id = "${id}"`);

  return rates[0];
}

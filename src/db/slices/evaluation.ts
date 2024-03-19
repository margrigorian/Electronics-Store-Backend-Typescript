import db from "../db.js";
import { FieldPacket, RowDataPacket } from "mysql2/promise";
import { ICommentsWithRates, IRates, IProductComment, IProductRating } from "../../lib/types.js";

export async function getComment(commentId: number): Promise<{ comment: IProductComment } | null> {
  const comment: [(RowDataPacket & IProductComment)[], FieldPacket[]] = await db.query(
    `SELECT * FROM product_comments WHERE comment_id = "${commentId}"`
  );

  if (comment[0][0]) {
    return {
      comment: comment[0][0]
    };
  }

  return null;
}

export async function postComment(productId: number, comment: string, userId: number): Promise<{ comment: IProductComment } | null> {
  let commentId: number | null = await getLastCommentId();

  if (commentId) {
    commentId = commentId + 1;
  } else {
    commentId = 1; // самый первый комментарий
  }

  await db.query(
    `
          INSERT INTO product_comments(product_id, comment_id, comment, user_id) 
          VALUES("${productId}", "${commentId}", "${comment}", "${userId}")
      `
  );

  const postedComment = await getComment(commentId);
  return postedComment;
}

export async function putComment(commentId: number, comment: string): Promise<{ comment: IProductComment } | null> {
  // обновляем
  await db.query(`UPDATE product_comments SET comment = "${comment}" WHERE comment_id = "${commentId}"`);
  // запрашиваем обновленный комментарий
  const updatedComment = await getComment(commentId);
  return updatedComment;
}

export async function deleteComment(commentId: number) {
  await db.query(`DELETE FROM product_comments WHERE comment_id = "${commentId}"`);
}

async function getLastCommentId(): Promise<number | null> {
  const lastId: [(RowDataPacket & { comment_id: number })[], FieldPacket[]] = await db.query(
    "SELECT comment_id FROM product_comments ORDER BY comment_id DESC LIMIT 1"
  );

  if (lastId[0][0]) {
    return lastId[0][0].comment_id;
  }

  return null; // комментариев еще нет
}

export async function getRates(id: number): Promise<IRates[]> {
  const rates: [(RowDataPacket & IRates)[], FieldPacket[]] = await db.query(`SELECT user_id, rate FROM product_rating WHERE product_id = "${id}"`);

  return rates[0];
}

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

export async function getUserRateOfProduct(productId: number, userId: number): Promise<{ rate: IProductRating } | null> {
  const rate: [(RowDataPacket & IProductRating)[], FieldPacket[]] = await db.query(
    `SELECT * FROM product_rating WHERE product_id = "${productId}" AND user_id = "${userId}"`
  );

  if (rate[0][0]) {
    return {
      rate: rate[0][0]
    };
  }

  return null;
}

export async function postRate(productId: number, rate: number, userId: number): Promise<{ rate: IProductRating } | null> {
  const userRate = await getUserRateOfProduct(productId, userId);

  // правило: один пользователь - одна оценка к товару, иначе будет дублирование строк в БД
  if (!userRate) {
    await db.query(
      `
          INSERT INTO product_rating(product_id, rate, user_id) 
          VALUES("${productId}", "${rate}", "${userId}")
          `
    );

    const postedRate = await getUserRateOfProduct(productId, userId);
    return postedRate;
  }

  return null;
}

export async function putRate(productId: number, rate: number, userId: number): Promise<{ rate: IProductRating } | null> {
  // дублирование можно останавливать на front
  await db.query(
    `
          UPDATE product_rating SET rate = "${rate}" 
          WHERE product_id = "${productId}" AND user_id = "${userId}"
      `
  );
  // запрашиваем обновленный объект с информацией об оценке
  const updatedRate = await getUserRateOfProduct(productId, userId);
  return updatedRate;
}

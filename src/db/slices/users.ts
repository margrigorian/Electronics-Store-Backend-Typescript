import db from "../db.js";
import { FieldPacket, RowDataPacket } from "mysql2/promise";
import { User } from "../../lib/types.js";

export async function getUser(email: string): Promise<User | undefined> {
  // не включаем email, чтобы не отображалось на front; password нужен для проверки
  const result: [(RowDataPacket & User)[], FieldPacket[]] = await db.query(
    `SELECT id, username, password, status FROM users WHERE email = "${email}"`
  ); // без "" не работает
  return result[0][0];
}

export async function addUser(username: string, email: string, hashpassword: string): Promise<User | undefined> {
  const lastIs = await getLastUserId();
  await db.query(`INSERT INTO users(id, username, email, password) VALUES(${lastIs + 1}, "${username}", "${email}", "${hashpassword}")`);
  return getUser(email);
}

async function getLastUserId(): Promise<string> {
  const result: [(RowDataPacket & { id: string })[], FieldPacket[]] = await db.query("SELECT id FROM users ORDER BY id DESC LIMIT 1");
  return result[0][0].id;
}

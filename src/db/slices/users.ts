import db from "../db.js";
import { FieldPacket, RowDataPacket } from "mysql2/promise";
import { IUser } from "../../lib/types.js";

export async function getUser(email: string): Promise<IUser | null> {
  // не включаем email, чтобы не отображалось на front; password нужен для проверки
  const result: [(RowDataPacket & IUser)[], FieldPacket[]] = await db.query(
    `SELECT id, username, password, status FROM users WHERE email = "${email}"`
  ); // без "" не работает

  const user: IUser | undefined = result[0][0];

  if (user) {
    return user;
  }

  return null;
}

export async function addUser(username: string, email: string, hashpassword: string): Promise<IUser | null> {
  const lastIs: string = await getLastUserId();
  await db.query(`INSERT INTO users(id, username, email, password) VALUES(${lastIs + 1}, "${username}", "${email}", "${hashpassword}")`);
  return getUser(email);
}

async function getLastUserId(): Promise<string> {
  const result: [(RowDataPacket & { id: string })[], FieldPacket[]] = await db.query("SELECT id FROM users ORDER BY id DESC LIMIT 1");
  const lastUserId: string = result[0][0].id;
  return lastUserId;
}

import bcript from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getUser, addUser } from "../db/slices/users.js";
import { secret } from "../lib/config.js";
import { IUser } from "../lib/types.js";

export async function checkUser(email: string, password: string): Promise<IUser | false | null> {
  // будет исп. и при регистрации и при логине
  const user = await getUser(email); // будет проходить проверка в базе данных
  let areSamePassword: undefined | boolean = undefined;

  if (user && user.password) {
    areSamePassword = await bcript.compare(password, user.password); // проверка соответствия пароля
    delete user.password; // чтобы на front не был отправлен пароль
  }

  if (user && areSamePassword) {
    // пользователь зарегистрирован, все данные верны
    return user;
  } else if (user) {
    // есть email, но не совпал пароль - исключаем ошибочную регистрацию
    return false;
  } else {
    return null; // пользователь не зарегистрирован
  }
}

export async function addNewUser(username: string, email: string, password: string): Promise<IUser | null> {
  const hashpassword = await bcript.hash(password, 10);
  const newUser = await addUser(username, email, hashpassword);
  // проверка, требуемая типизацией
  if (newUser && newUser.password) {
    // чтобы на front не был отправлен пароль
    delete newUser.password;
  }

  return newUser;
}

export function getToken(email: string) {
  const payload = {
    email
  };

  const token = jwt.sign(payload, secret, { expiresIn: "12h" });
  return token;
}

export async function checkToken(token: string): Promise<IUser | null> {
  try {
    const decodedToken: string | JwtPayload = jwt.verify(token, secret); // при ошибке пробрасывает throw

    if (typeof decodedToken === "object") {
      const user = await getUser(decodedToken.email); // проверка наличия юзера с таким email, возращ. объект c пользователем

      if (user) {
        // пользователь найден
        return user;
      }
    }

    return null;
  } catch (err) {
    return null; // в случае ошибки jwt.verify
  }
}

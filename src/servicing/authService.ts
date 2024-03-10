import bcript from "bcryptjs";
import { getUser, addUser } from "../db/slices/users.js";
import { User } from "../lib/types.js";

export async function checkUser(email: string, password: string): Promise<User | false | null> {
  // будет исп. и при регистрации и при логине
  const user = await getUser(email); // будет проходить проверка в базе данных
  let areSamePassword = undefined;

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

export async function addNewUser(username: string, email: string, password: string): Promise<User | undefined> {
  const hashpassword = await bcript.hash(password, 10);
  const newUser = await addUser(username, email, hashpassword);
  // проверка, требуемая типизацией
  if (newUser && newUser.password) {
    // чтобы на front не был отправлен пароль
    delete newUser.password;
  }

  return newUser;
}

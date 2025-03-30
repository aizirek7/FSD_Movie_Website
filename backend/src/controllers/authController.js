import bcrypt from "bcrypt";
import {
  addUser,
  createToken,
  getUserByEmail,
} from "../services/authService.js";
import Joi from "joi";

export async function register(ctx) {
  const joiSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { email, password } = await joiSchema.validateAsync(ctx.request.body);

  const passwordHash = await bcrypt.hash(password, 12);
  const dbUser = await addUser(email, passwordHash);

  ctx.status = 201;
  ctx.body = { dbUser };
}

export async function login(ctx) {
  const joiSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { email, password } = await joiSchema.validateAsync(ctx.request.body);

  const dbUser = await getUserByEmail(email);

  if (!dbUser) {
    ctx.status = 404;
    ctx.body = { error: "USER_NOT_FOUND" };
    return;
  }

  const match = await bcrypt.compare(password, dbUser.password_hash);

  if (!match) {
    ctx.status = 401;
    ctx.body = { error: "login or password is incorrect" };
    return;
  }

  const token = await createToken(dbUser.id);

  ctx.status = 200;
  ctx.body = { ok: true, token };
  ctx.cookies.set("token", token, { httpOnly: true });
}

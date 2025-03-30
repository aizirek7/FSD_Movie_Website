import { getKnex } from "../utils/knex.js";
import { fetchCurrentUser } from "../services/authService.js";

const knex = await getKnex();

export default async function authChecker(ctx, next) {
  const { headers } = ctx.request;
  const { authorization } = headers;
  const [_, token] = (authorization || "").split(" ");

  const error = new Error("NOT_AUTHORIZED");
  error.status = 401;

  if (token) {
    const userInfo = await fetchCurrentUser(token);
    if (!userInfo) {
      throw error;
    }

    ctx.state.user = userInfo;
    return next();
  }
  const cookie = ctx.cookies.get("token");
  if (cookie) {
    const userInfo = await fetchCurrentUser(cookie);
    if (!userInfo) {
      throw error;
    }

    ctx.state.user = userInfo;
    return next();
  }
  throw error;
}

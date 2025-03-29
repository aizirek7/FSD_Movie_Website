import { fetchUsers, fetchTokens } from "../services/userService.js";

export async function getUsers(ctx) {
  const users = await fetchUsers();

  ctx.body = { users };
  ctx.status = 200;
}

export async function getTokens(ctx) {
  const tokens = await fetchTokens();

  ctx.body = { tokens };
  ctx.status = 200;
}

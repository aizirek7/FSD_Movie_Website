import { getKnex } from "../utils/knex.js";

export async function addFavorite(ctx) {
  console.log("Received headers:", ctx.request.headers);
  console.log("Received body:", ctx.request.body);

  const { movie_id } = ctx.request.body;
  const userId = ctx.state.user?.id;

  console.log("Extracted User ID:", userId);
  console.log("Extracted Movie ID:", movie_id);

  if (!movie_id || !userId) {
    ctx.status = 400;
    ctx.body = { error: "MISSING_MOVIE_ID_OR_USER" };
    return;
  }

  const knex = await getKnex();

  const existing = await knex("favorites")
    .where({ user_id: userId, movie_id })
    .first();
  if (existing) {
    ctx.status = 409;
    ctx.body = { error: "MOVIE_ALREADY_IN_FAVORITES" };
    return;
  }

  await knex("favorites").insert({ user_id: userId, movie_id });

  ctx.status = 201;
  ctx.body = { ok: true, message: "Movie added to favorites" };
}

export async function getFavorites(ctx) {
  const userId = ctx.state.user?.id;

  console.log("Fetching favorites for user:", userId);

  if (!userId) {
    ctx.status = 401;
    ctx.body = { error: "UNAUTHORIZED" };
    return;
  }

  const knex = await getKnex();

  const favorites = await knex("favorites")
    .where({ user_id: userId })
    .select("*");

  ctx.status = 200;
  ctx.body = { favorites };
}

export async function removeFavorite(ctx) {
  console.log("removeFavorite function called");
  const userId = ctx.state.user?.id;
  const { movie_id } = ctx.request.body;

  console.log("Removing favorite:", { userId, movie_id });

  if (!userId || !movie_id) {
    ctx.status = 400;
    ctx.body = { error: "MISSING_MOVIE_ID_OR_USER" };
    return;
  }

  const knex = await getKnex();

  // Debug: Check what the database returns
  const existing = await knex("favorites")
    .where({ user_id: userId, movie_id })
    .select("created_at")
    .first();

  console.log("Existing favorite:", existing); // Debugging

  if (!existing) {
    ctx.status = 404;
    ctx.body = { error: "MOVIE_NOT_FOUND_IN_FAVORITES" };
    return;
  }

  console.log(`Removing favorite added on: ${existing.created_at}`);

  // Perform delete operation
  const deletedRows = await knex("favorites")
    .where({ user_id: userId, movie_id })
    .del();

  console.log("Deleted rows:", deletedRows); // Debugging

  ctx.status = 200;
  ctx.body = { ok: true, message: "Movie removed from favorites" };
}

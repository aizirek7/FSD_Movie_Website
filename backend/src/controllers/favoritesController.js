import { getKnex } from "../utils/knex.js";

export async function addFavorite(ctx) {
  console.log("Received headers:", ctx.request.headers); // Debug headers
  console.log("Received body:", ctx.request.body); // Debug request body

  const { movie_id } = ctx.request.body;
  const userId = ctx.state.user?.id;

  console.log("Extracted User ID:", userId); // Debug user authentication
  console.log("Extracted Movie ID:", movie_id); // Debug extracted movie ID

  if (!movie_id || !userId) {
    ctx.status = 400;
    ctx.body = { error: "MISSING_MOVIE_ID_OR_USER" };
    return;
  }

  const knex = await getKnex();

  // Check if the movie is already in favorites
  const existing = await knex("favorites")
    .where({ user_id: userId, movie_id })
    .first();
  if (existing) {
    ctx.status = 409;
    ctx.body = { error: "MOVIE_ALREADY_IN_FAVORITES" };
    return;
  }

  // Insert into favorites
  await knex("favorites").insert({ user_id: userId, movie_id });

  ctx.status = 201;
  ctx.body = { ok: true, message: "Movie added to favorites" };
}

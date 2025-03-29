import { getKnex } from "../utils/knex.js"; // ✅ Ensure correct path

export async function addFavorite(userId, movieId) {
  const knex = await getKnex(); // ✅ Ensure async/await is used

  const existing = await knex("favorites")
    .where({ user_id: userId, movie_id: movieId })
    .first();

  if (existing) {
    return true; // ✅ Movie already exists
  }

  await knex("favorites").insert({ user_id: userId, movie_id: movieId });
  return false;
}

export async function getFavorites(userId) {
  const knex = await getKnex();
  return knex("favorites").where({ user_id: userId }).select("*");
}

export async function removeFavorite(userId, movieId) {
  const knex = await getKnex();

  const existing = await knex("favorites")
    .where({ user_id: userId, movie_id: movieId })
    .first();

  if (!existing) {
    return false; // ✅ Movie not found
  }

  await knex("favorites").where({ user_id: userId, movie_id: movieId }).del();
  return true;
}

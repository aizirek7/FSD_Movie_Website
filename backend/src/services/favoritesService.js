import { getKnex } from "../utils/knex.js";

export async function addFavorite(userId, movieId) {
  const knex = await getKnex();
  return knex("favorites")
    .insert({ user_id: userId, movie_id: movieId })
    .returning("*");
}

export async function removeFavorite(userId, movieId) {
  const knex = await getKnex();
  return knex("favorites").where({ user_id: userId, movie_id: movieId }).del();
}

export async function getFavorites(userId) {
  const knex = await getKnex();
  return knex("favorites")
    .where({ user_id: userId })
    .select("movie_id", "created_at");
}

export async function isFavorite(userId, movieId) {
  const knex = await getKnex();
  const favorite = await knex("favorites")
    .where({ user_id: userId, movie_id: movieId })
    .first();
  return !!favorite;
}

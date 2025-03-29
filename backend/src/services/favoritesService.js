export async function addFavorite(userId, movieId) {
  const knex = await getKnex();

  const existing = await knex("favorites")
    .where({ user_id: userId, movie_id: movieId })
    .first();
  if (existing) {
    return true;
  }

  await knex("favorites").insert({ user_id: userId, movie_id: movieId });
  return false;
}

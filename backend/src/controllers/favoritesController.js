import {
  addFavorite as addFavoriteService,
  getFavorites as getFavoritesService,
  removeFavorite as removeFavoriteService,
} from "../services/favoritesService.js";

export async function addFavorite(ctx) {
  console.log("Received request:", ctx.request.body);

  const { movie_id } = ctx.request.body;
  const userId = ctx.state.user?.id;

  if (!movie_id || !userId) {
    ctx.status = 400;
    ctx.body = { error: "MISSING_MOVIE_ID_OR_USER" };
    return;
  }

  try {
    const alreadyExists = await addFavoriteService(userId, movie_id);
    if (alreadyExists) {
      ctx.status = 409;
      ctx.body = { error: "MOVIE_ALREADY_IN_FAVORITES" };
      return;
    }

    ctx.status = 201;
    ctx.body = { ok: true, message: "Movie added to favorites" };
  } catch (error) {
    console.error("Error adding favorite:", error);
    ctx.status = 500;
    ctx.body = { error: "INTERNAL_SERVER_ERROR" };
  }
}

export async function getFavorites(ctx) {
  const userId = ctx.state.user?.id;

  if (!userId) {
    ctx.status = 401;
    ctx.body = { error: "UNAUTHORIZED" };
    return;
  }

  try {
    const favorites = await getFavoritesService(userId);
    ctx.status = 200;
    ctx.body = { favorites };
  } catch (error) {
    console.error("Error fetching favorites:", error);
    ctx.status = 500;
    ctx.body = { error: "INTERNAL_SERVER_ERROR" };
  }
}

export async function removeFavorite(ctx) {
  const { movie_id } = ctx.request.body;
  const userId = ctx.state.user?.id;

  if (!userId || !movie_id) {
    ctx.status = 400;
    ctx.body = { error: "MISSING_MOVIE_ID_OR_USER" };
    return;
  }

  try {
    const removed = await removeFavoriteService(userId, movie_id);
    if (!removed) {
      ctx.status = 404;
      ctx.body = { error: "MOVIE_NOT_FOUND_IN_FAVORITES" };
      return;
    }

    ctx.status = 200;
    ctx.body = { ok: true, message: "Movie removed from favorites" };
  } catch (error) {
    console.error("Error removing favorite:", error);
    ctx.status = 500;
    ctx.body = { error: "INTERNAL_SERVER_ERROR" };
  }
}

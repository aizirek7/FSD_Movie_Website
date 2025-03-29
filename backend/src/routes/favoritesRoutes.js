import Router from "koa-router";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "../controllers/favoritesController.js";

export const router = new Router();

router.post("/favorites", addFavorite);
router.get("/favorites", getFavorites);
router.delete("/favorites", removeFavorite);

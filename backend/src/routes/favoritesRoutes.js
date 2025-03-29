import Router from "koa-router";
import {
  addFavorite,
  getFavorites,
} from "../controllers/favoritesController.js";

const router = new Router({ prefix: "/favorites" });

router.post("/", addFavorite);
router.get("/", getFavorites);

export { router as favoritesRouter };

import Koa from "koa";
import bodyparser from "koa-bodyparser";
import { HTTP_PORT } from "./utils/config.js";

import { userRouter } from "./routes/userRoutes.js";
import { authRouter } from "./routes/authRoutes.js";

import logger from "./middlewares/logger.js";
import errorHandler from "./middlewares/errorHandler.js";
import authChecker from "./middlewares/authChecker.js";

async function main() {
  console.log("start", new Date());
  const app = new Koa();

  app.use(bodyparser());
  app.use(errorHandler);
  app.use(logger);

  app.use(authRouter.routes());
  app.use(authChecker);
  app.use(userRouter.routes());

  app.use(async (ctx) => {
    ctx.body = {
      Message: "Welcome to the Backend",
    };
    ctx.status = 200;
  });

  app.listen(HTTP_PORT, () => {
    console.log(`Server started at port: ${HTTP_PORT}`);
  });
}

main().catch((e) => {
  console.log(e);
  process.exit(1);
});

import * as Koa from "koa";
import * as cors from "@koa/cors";
import * as bodyParser from "koa-bodyparser";
import { router, protectedRouter } from "./routes";
import logger from "./logger";
import { AppDataSource } from "./data-source";
import "reflect-metadata";
import { JWT_SECRET } from "./constants";
import * as jwt from "koa-jwt";

AppDataSource.initialize()
  .then(async () => {
    const app = new Koa();

    app.use(logger());
    app.use(cors());
    app.use(bodyParser());

    app.use(async (ctx, next) => {
      try {
        await next();
      } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = {
          message: err.message,
        };
      }
    });

    // 响应用户请求
    app.use(router.routes()).use(router.allowedMethods());

    // 注册jwt中间件
    app.use(
      jwt({
        secret: JWT_SECRET,
      }).unless({
        method: "GET",
      })
    );

    app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods());

    app.listen(3000, () => {
      console.log("the port 3000 is running in koa");
    });
  })
  .catch((err) => console.log(err));

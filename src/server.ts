import * as Koa from "koa";
import * as cors from "@koa/cors";
import * as bodyParser from "koa-bodyparser";
import router from "./routes";
import logger from "./logger";
import { AppDataSource } from "./data-source";

AppDataSource.initialize()
  .then(async () => {
    const app = new Koa();

    app.use(logger());
    app.use(cors());
    app.use(bodyParser());

    // 响应用户请求
    app.use(router.routes()).use(router.allowedMethods());

    app.listen(3000, () => {
      console.log("the port 3000 is running in koa");
    });
  })
  .catch((err) => console.log(err));

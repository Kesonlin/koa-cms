import * as Router from "@koa/router";

import AuthController from "./controllers/auth";
import UserController from "./controllers/user";

const router = new Router();
// console.log(router);

router.post("/auth/login", AuthController.login);
router.post("/auth/register", AuthController.register);

const protectedRouter = new Router();
protectedRouter.get("/users", UserController.listUsers);
protectedRouter.get("/users/:id", UserController.showUserDetail);
protectedRouter.put("/users/:id", UserController.updateUser);
protectedRouter.delete("/users/:id", UserController.deleteUser);

export { router, protectedRouter };

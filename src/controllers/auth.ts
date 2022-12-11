import { Context } from "Koa";
import { User } from "../entity/user";
import { AppDataSource } from "../data-source";
import * as argon2 from "argon2";

interface UserType {
  name: string;
  password: string;
  email: string;
}

export default class AuthController {
  public static async login(ctx: Context) {
    ctx.body = "login controller";
  }

  public static async register(ctx: Context) {
    type RequestType = typeof ctx.request.body;

    const body: any = ctx.request.body;
    const UserResponity = AppDataSource.getRepository(User);

    const newUser = new User();

    // const { name, password, email } = ctx.request.body;
    newUser.name = body.name;
    newUser.email = body.email;
    newUser.password = await argon2.hash(body.password);

    const user = await UserResponity.save(newUser);

    ctx.status = 200;
    ctx.body = user;
  }
}

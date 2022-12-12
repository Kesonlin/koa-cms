import { Context } from "Koa";
import { User } from "../entity/user";
import { AppDataSource } from "../data-source";
import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants";
import { ExistException, UnauthorizedException } from "../exception";

interface UserType {
  name: string;
  password: string;
  email: string;
}

export default class AuthController {
  public static async login(ctx: Context) {
    const body: any = ctx.request.body;
    const UserResponity = AppDataSource.getRepository(User);
    const user = await UserResponity.findOneBy({
      name: body.name,
    });
    console.log(body);
    console.log(user);

    if (!user) {
      // ctx.status = 404;
      // ctx.body = {
      //   message: "用户名不存在",
      // };
      throw new UnauthorizedException("用户名不存在");
    } else if (await argon2.verify(user.password, body.password)) {
      ctx.status = 200;
      ctx.body = { token: jwt.sign({ id: user.id }, JWT_SECRET) };
    } else {
      // ctx.status = 401;
      // ctx.body = { message: "密码错误" };
      throw new UnauthorizedException("密码错误");
    }

    // ctx.body = "login controller";
  }

  public static async register(ctx: Context) {
    type RequestType = typeof ctx.request.body;

    const body: any = ctx.request.body;
    const UserResponity = AppDataSource.getRepository(User);

    // const isUser = await UserResponity.findOne({
    //   where: [
    //     {
    //       name: body.name,
    //       email: body.email,
    //     },
    //   ],
    // });

    const isUser = await UserResponity.findOneBy({
      name: body.name,
      email: body.email,
    });

    console.log(isUser);

    if (isUser) {
      throw new ExistException("用户已经存在");
      return;
    }

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

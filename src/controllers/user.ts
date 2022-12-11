import { Context } from "Koa";
import { User } from "../entity/user";
import { AppDataSource } from "../data-source";
import { createSecretKey } from "crypto";

export default class UserController {
  public static async listUsers(ctx: Context) {
    const UserResponity = AppDataSource.getRepository(User);
    const result = await UserResponity.find();
    ctx.body = result;
  }
  public static async showUserDetail(ctx: Context) {
    const UserResponity = AppDataSource.getRepository(User);
    const id = ctx.params.id;
    console.log(id);

    const result = await UserResponity.findOneBy({
      id,
    });

    if (result) {
      ctx.status = 200;
      ctx.body = result;
    } else {
      ctx.status = 404;
    }
  }

  public static async updateUser(ctx: Context) {
    const UserResponity = AppDataSource.getRepository(User);
    const id = ctx.params.id;
    const newData = ctx.request.body;

    /*
    第一种更新方法
    await AppDataSource.createQueryBuilder()
      .update(User)
      .set(newData)
      .where("id = :id", { id })
      .execute();
    */
    // console.log(id, newData);

    // 第二种更新方法
    await UserResponity.update(id, newData);

    const user = await UserResponity.findOneBy({
      id,
    });

    // const newUser = Object.assign(user, newData)

    // await UserResponity.save(newUser)

    if (user) {
      ctx.status = 200;
      ctx.body = user;
    } else {
      ctx.status = 404;
    }
  }

  public static async deleteUser(ctx: Context) {
    const id = ctx.params.id;
    const UserResponity = AppDataSource.getRepository(User);
    const user = await UserResponity.findOneBy({
      id,
    });

    if (user) {
      await UserResponity.remove(user);
      ctx.status = 200;
      ctx.body = `delect user from id = ${id} successfully`;
    } else {
      ctx.status = 404;
    }
  }
}

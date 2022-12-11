import { Context } from "Koa";

type nextType = () => Promise<void>;

export default function logger() {
  return async (ctx: Context, next: nextType) => {
    const start = Date.now();
    await next();
    const time = Date.now() - start;
    console.log(`${ctx.method}--${ctx.url}--${ctx.status}--${time}`);
  };
}

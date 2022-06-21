import koa from "koa";
import { router_preprocessing, use_prefix } from "./router";

const app = new koa();
app
  .use(router_preprocessing)
  .use(use_prefix("/test"))
  .use(async (ctx) => {
    ctx.consumPath(0);
  })
  .listen(3000, () => console.log("开始监听"));

# 说明

用于代替原本的 koa-router，由于原本的 router 库使用麻烦，不符合 koa 中间件的风格，类型化孱弱，且面对自定义程度较高的需求无法满足，故再造一个 router 库以满足构建 mvc 框架的需求

# 基本使用方法

```ts
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
```

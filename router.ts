/**
 * 实现了自定义的rooter功能 代替原来 koarouter
 */

import type koa from "koa";
import { Push, Concat, SNum, Zero, Dec, sDec, sMoreThan } from "ts-metacode";
//repeat<string,2>=[string,string]
type Repeat<T, Count extends SNum> = Count extends Zero
  ? []
  : Push<Repeat<T, sDec<Count>>, T>;

export interface CustomContext {
  _pathArray: string[];
  _pathDepth: number;
  pathArray(): Readonly<string[]>;
  pathDepth(): number;
  restPathDepth(): number;
  restPathArray(): Readonly<string[]>;
  /**
   *
   * @param count 要消费的路径长度
   */
  consumPath<T extends number = 1>(
    count: T
  ): Readonly<string[] & { length: T }>;
}
/**
 * 应该在最前面被使用 进行path的预处理工作
 * 本处理器会将path处理为数组形式并添加操作path的工具方法
 */
export const router_preprocessing = (async (ctx, next) => {
  ctx._pathArray = ctx.path.split("/").filter((v) => v.trim() != "");
  ctx._pathDepth = 0;
  ctx.pathArray = () => ctx._pathArray;
  ctx.pathDepth = () => ctx._pathDepth;
  ctx.restPathDepth = () => {
    return ctx.pathArray().length - ctx._pathDepth;
  };
  ctx.restPathArray = () => {
    return ctx.pathArray().slice(ctx.pathDepth());
  };
  ctx.consumPath = (count) => {
    if (count > ctx.restPathDepth()) {
      //不可获取
      throw new Error("错误，剩下的Path长度不足");
    }
    //可以获取
    const ret = ctx.restPathArray().slice(0, count);
    ctx._pathDepth += count;
    return ret as any;
  };

  return next();
}) as koa.Middleware<{}, CustomContext>;

/**
 * 使用前缀限定 consume前面的几个
 */
export const use_prefix = (prefix: string) => {
  const arr = prefix.split("/").filter((v) => v.trim() != "");
  return (async (ctx, next) => {
    //consume
    //匹配如果都符合则consume
    //如果长度不够肯定不符合
    if (ctx.restPathDepth() < arr.length) return;
    const rest = ctx.restPathArray();
    //全部匹配则ok
    const isok = arr.reduce((prev, curr, idx) => {
      return prev && curr == rest[idx];
    }, true);
    if (isok) {
      const p = ctx.consumPath(arr.length);
      console.log("使用前缀路径:", p);
    }
  }) as koa.Middleware<{}, CustomContext>;
};

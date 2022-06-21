/**
 * 实现了自定义的rooter功能 代替原来 koarouter
 */
import type koa from "koa";
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
    consumPath<T extends number = 1>(count: T): Readonly<string[] & {
        length: T;
    }>;
}
/**
 * 应该在最前面被使用 进行path的预处理工作
 * 本处理器会将path处理为数组形式并添加操作path的工具方法
 */
export declare const router_preprocessing: koa.Middleware<{}, CustomContext, any>;
/**
 * 使用前缀限定 consume前面的几个
 */
export declare const use_prefix: (prefix: string) => koa.Middleware<{}, CustomContext, any>;

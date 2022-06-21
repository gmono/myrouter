"use strict";
/**
 * 实现了自定义的rooter功能 代替原来 koarouter
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.use_prefix = exports.router_preprocessing = void 0;
/**
 * 应该在最前面被使用 进行path的预处理工作
 * 本处理器会将path处理为数组形式并添加操作path的工具方法
 */
exports.router_preprocessing = ((ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        return ret;
    };
    return next();
}));
/**
 * 使用前缀限定 consume前面的几个
 */
const use_prefix = (prefix) => {
    const arr = prefix.split("/").filter((v) => v.trim() != "");
    return ((ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
        //consume
        //匹配如果都符合则consume
        //如果长度不够肯定不符合
        if (ctx.restPathDepth() < arr.length)
            return;
        const rest = ctx.restPathArray();
        //全部匹配则ok
        const isok = arr.reduce((prev, curr, idx) => {
            return prev && curr == rest[idx];
        }, true);
        if (isok) {
            const p = ctx.consumPath(arr.length);
            console.log("使用前缀路径:", p);
        }
    }));
};
exports.use_prefix = use_prefix;
//# sourceMappingURL=router.js.map
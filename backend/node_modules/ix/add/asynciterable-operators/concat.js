"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.concatProto = void 0;
const asynciterablex_1 = require("../../asynciterable/asynciterablex");
const concat_1 = require("../../asynciterable/concat");
/**
 * @ignore
 */
function concatProto(...args) {
    // @ts-ignore
    return (0, concat_1.concat)(this, ...args);
}
exports.concatProto = concatProto;
asynciterablex_1.AsyncIterableX.prototype.concat = concatProto;

//# sourceMappingURL=concat.js.map

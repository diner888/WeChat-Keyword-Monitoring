"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.concatMapProto = void 0;
const asynciterablex_1 = require("../../asynciterable/asynciterablex");
const concatmap_1 = require("../../asynciterable/operators/concatmap");
/**
 * @ignore
 */
function concatMapProto(selector, thisArg) {
    return (0, concatmap_1.concatMap)(selector, thisArg)(this);
}
exports.concatMapProto = concatMapProto;
asynciterablex_1.AsyncIterableX.prototype.concatMap = concatMapProto;

//# sourceMappingURL=concatmap.js.map

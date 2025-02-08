"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.switchMapProto = void 0;
const asynciterablex_1 = require("../../asynciterable/asynciterablex");
const switchmap_1 = require("../../asynciterable/operators/switchmap");
/**
 * @ignore
 */
function switchMapProto(selector, thisArg) {
    return (0, switchmap_1.switchMap)(selector, thisArg)(this);
}
exports.switchMapProto = switchMapProto;
asynciterablex_1.AsyncIterableX.prototype.switchMap = switchMapProto;

//# sourceMappingURL=switchmap.js.map

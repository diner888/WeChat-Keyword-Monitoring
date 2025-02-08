"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pluckProto = void 0;
const iterablex_1 = require("../../iterable/iterablex");
const pluck_1 = require("../../iterable/operators/pluck");
/**
 * @ignore
 */
function pluckProto(...args) {
    return (0, pluck_1.pluck)(...args)(this);
}
exports.pluckProto = pluckProto;
iterablex_1.IterableX.prototype.pluck = pluckProto;

//# sourceMappingURL=pluck.js.map

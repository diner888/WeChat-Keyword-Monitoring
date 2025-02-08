"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.innerJoinProto = void 0;
const iterablex_1 = require("../../iterable/iterablex");
const innerjoin_1 = require("../../iterable/operators/innerjoin");
/**
 * @ignore
 */
function innerJoinProto(inner, outerSelector, innerSelector, resultSelector) {
    return (0, innerjoin_1.innerJoin)(inner, outerSelector, innerSelector, resultSelector)(this);
}
exports.innerJoinProto = innerJoinProto;
iterablex_1.IterableX.prototype.innerJoin = innerJoinProto;

//# sourceMappingURL=innerjoin.js.map

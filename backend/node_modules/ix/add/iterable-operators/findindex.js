"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findIndexProto = void 0;
const iterablex_1 = require("../../iterable/iterablex");
const findindex_1 = require("../../iterable/findindex");
/**
 * @ignore
 */
function findIndexProto(options) {
    return (0, findindex_1.findIndex)(this, options);
}
exports.findIndexProto = findIndexProto;
iterablex_1.IterableX.prototype.findIndex = findIndexProto;

//# sourceMappingURL=findindex.js.map

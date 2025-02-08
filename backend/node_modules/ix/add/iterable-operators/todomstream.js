"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDOMStreamProto = void 0;
const iterablex_1 = require("../../iterable/iterablex");
const todomstream_1 = require("../../iterable/todomstream");
function toDOMStreamProto(options) {
    return !options ? (0, todomstream_1.toDOMStream)(this) : (0, todomstream_1.toDOMStream)(this, options);
}
exports.toDOMStreamProto = toDOMStreamProto;
iterablex_1.IterableX.prototype.toDOMStream = toDOMStreamProto;

//# sourceMappingURL=todomstream.js.map

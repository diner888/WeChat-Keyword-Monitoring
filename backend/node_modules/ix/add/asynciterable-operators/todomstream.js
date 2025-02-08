"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDOMStreamProto = void 0;
const asynciterablex_1 = require("../../asynciterable/asynciterablex");
const todomstream_1 = require("../../asynciterable/todomstream");
function toDOMStreamProto(options) {
    return !options ? (0, todomstream_1.toDOMStream)(this) : (0, todomstream_1.toDOMStream)(this, options);
}
exports.toDOMStreamProto = toDOMStreamProto;
asynciterablex_1.AsyncIterableX.prototype.toDOMStream = toDOMStreamProto;

//# sourceMappingURL=todomstream.js.map

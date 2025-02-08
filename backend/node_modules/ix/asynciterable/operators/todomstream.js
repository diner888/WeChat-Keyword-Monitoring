"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDOMStream = void 0;
const todomstream_1 = require("../../asynciterable/todomstream");
function toDOMStream(options) {
    return function toDOMStreamOperatorFunction(source) {
        if (!options || !('type' in options) || options['type'] !== 'bytes') {
            return (0, todomstream_1.toDOMStream)(source, options);
        }
        return (0, todomstream_1.toDOMStream)(source, options);
    };
}
exports.toDOMStream = toDOMStream;

//# sourceMappingURL=todomstream.js.map

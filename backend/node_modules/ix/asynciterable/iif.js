"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iif = void 0;
const defer_1 = require("./defer");
const empty_1 = require("./empty");
/**
 * If the specified condition evaluates true, select the thenSource sequence.
 * Otherwise, select the elseSource sequence.
 *
 * @template TSource The type of the elements in the result sequence.
 * @param {((signal?: AbortSignal) => boolean | Promise<boolean>)} condition Condition evaluated to decide which sequence to return.
 * @param {AsyncIterable<TSource>} thenSource Sequence returned in case evaluates true.
 * @param {AsyncIterable<TSource>} [elseSource=empty()] Sequence returned in case condition evaluates false.
 * @returns {AsyncIterableX<TSource>} thenSource if condition evaluates true; elseSource otherwise.
 */
function iif(condition, thenSource, elseSource = (0, empty_1.empty)()) {
    return (0, defer_1.defer)(async (signal) => ((await condition(signal)) ? thenSource : elseSource));
}
exports.iif = iif;

//# sourceMappingURL=iif.js.map

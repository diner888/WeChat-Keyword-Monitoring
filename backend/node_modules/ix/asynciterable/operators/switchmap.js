"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.switchMap = void 0;
const _flatten_1 = require("./_flatten");
/**
 * Projects each element of an async-iterable sequence to an async-iterable sequence,
 * emitting values only from the most recently projected async-iterable sequence.
 *
 * @template TSource The type of the elements in the source sequence.
 * @template TResult The type of the elements in the projected inner sequences and the elements in the merged result sequence.
 * @param {((
 *     value: TSource,
 *     index: number,
 *     signal?: AbortSignal
 *   ) => AsyncIterableInput<TResult>)} selector A transform function to apply to each element.
 * @param {*} [thisArg] Option this for binding to the selector.
 * @returns {OperatorAsyncFunction<TSource, TResult>} An operator that creates an async-iterable sequence whose
 * elements are the result of invoking the one-to-many transform function on each element of the input sequence.
 */
function switchMap(selector, thisArg) {
    return function switchMapOperatorFunction(source) {
        return new _flatten_1.FlattenConcurrentAsyncIterable(source, selector, 1, true, thisArg);
    };
}
exports.switchMap = switchMap;

//# sourceMappingURL=switchmap.js.map

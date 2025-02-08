"use strict";
/* eslint-disable @typescript-eslint/ban-types */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFetchResponse = exports.isWritableDOMStream = exports.isReadableDOMStream = exports.isWritableNodeStream = exports.isReadableNodeStream = exports.isObservable = exports.isAsyncIterable = exports.isIterator = exports.isIterable = exports.isArrayLike = exports.isPromise = exports.isObject = exports.isFunction = void 0;
/** @ignore */
const isNumber = (x) => typeof x === 'number';
/** @ignore */
const isBoolean = (x) => typeof x === 'boolean';
/** @ignore */
const isFunction = (x) => typeof x === 'function';
exports.isFunction = isFunction;
/** @ignore */
const isObject = (x) => x != null && Object(x) === x;
exports.isObject = isObject;
/** @ignore */
const isPromise = (x) => {
    return (0, exports.isObject)(x) && (0, exports.isFunction)(x.then);
};
exports.isPromise = isPromise;
/** @ignore */
function isArrayLike(x) {
    return (0, exports.isObject)(x) && isNumber(x['length']);
}
exports.isArrayLike = isArrayLike;
/** @ignore */
function isIterable(x) {
    return x != null && (0, exports.isFunction)(x[Symbol.iterator]);
}
exports.isIterable = isIterable;
/** @ignore */
function isIterator(x) {
    return (0, exports.isObject)(x) && !(0, exports.isFunction)(x[Symbol.iterator]) && (0, exports.isFunction)(x['next']);
}
exports.isIterator = isIterator;
/** @ignore */
function isAsyncIterable(x) {
    return (0, exports.isObject)(x) && (0, exports.isFunction)(x[Symbol.asyncIterator]);
}
exports.isAsyncIterable = isAsyncIterable;
/** @ignore */
function isObservable(x) {
    return x != null && Object(x) === x && typeof x['subscribe'] === 'function';
}
exports.isObservable = isObservable;
/** @ignore */
const isReadableNodeStream = (x) => {
    return ((0, exports.isObject)(x) &&
        (0, exports.isFunction)(x['pipe']) &&
        (0, exports.isFunction)(x['_read']) &&
        isBoolean(x['readable']) &&
        (0, exports.isObject)(x['_readableState']));
};
exports.isReadableNodeStream = isReadableNodeStream;
/** @ignore */
const isWritableNodeStream = (x) => {
    return ((0, exports.isObject)(x) &&
        (0, exports.isFunction)(x['end']) &&
        (0, exports.isFunction)(x['_write']) &&
        isBoolean(x['writable']) &&
        (0, exports.isObject)(x['_writableState']));
};
exports.isWritableNodeStream = isWritableNodeStream;
/** @ignore */
const isReadableDOMStream = (x) => {
    return (0, exports.isObject)(x) && (0, exports.isFunction)(x['cancel']) && (0, exports.isFunction)(x['getReader']);
};
exports.isReadableDOMStream = isReadableDOMStream;
/** @ignore */
const isWritableDOMStream = (x) => {
    return (0, exports.isObject)(x) && (0, exports.isFunction)(x['abort']) && (0, exports.isFunction)(x['getWriter']);
};
exports.isWritableDOMStream = isWritableDOMStream;
/** @ignore */
const isFetchResponse = (x) => {
    return (0, exports.isObject)(x) && (0, exports.isReadableDOMStream)(x['body']);
};
exports.isFetchResponse = isFetchResponse;

//# sourceMappingURL=isiterable.js.map

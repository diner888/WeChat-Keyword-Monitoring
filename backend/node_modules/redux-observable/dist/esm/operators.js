import { filter } from 'rxjs/operators';
import { warn } from './utils/console';
var keyHasType = function (type, key) {
    return type === key || (typeof key === 'function' && type === key.toString());
};
/**
 * Inferring the types of this is a bit challenging, and only works in newer
 * versions of TypeScript.
 *
 * @param ...types One or more Redux action types you want to filter for, variadic.
 */
export function ofType() {
    var types = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        types[_i] = arguments[_i];
    }
    var len = types.length;
    if (process.env.NODE_ENV !== 'production') {
        if (len === 0) {
            warn('ofType was called without any types!');
        }
        if (types.some(function (key) { return key === null || key === undefined; })) {
            warn('ofType was called with one or more undefined or null values!');
        }
    }
    return filter(len === 1
        ? function (action) { return keyHasType(action.type, types[0]); }
        : function (action) {
            for (var i = 0; i < len; i++) {
                if (keyHasType(action.type, types[i])) {
                    return true;
                }
            }
            return false;
        });
}

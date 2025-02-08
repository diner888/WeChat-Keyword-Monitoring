import { filter } from 'rxjs/operators';
import { warn } from './utils/console';
const keyHasType = (type, key) => {
    return type === key || (typeof key === 'function' && type === key.toString());
};
/**
 * Inferring the types of this is a bit challenging, and only works in newer
 * versions of TypeScript.
 *
 * @param ...types One or more Redux action types you want to filter for, variadic.
 */
export function ofType(...types) {
    const len = types.length;
    if (process.env.NODE_ENV !== 'production') {
        if (len === 0) {
            warn('ofType was called without any types!');
        }
        if (types.some(key => key === null || key === undefined)) {
            warn('ofType was called with one or more undefined or null values!');
        }
    }
    return filter(len === 1
        ? (action) => keyHasType(action.type, types[0])
        : (action) => {
            for (let i = 0; i < len; i++) {
                if (keyHasType(action.type, types[i])) {
                    return true;
                }
            }
            return false;
        });
}

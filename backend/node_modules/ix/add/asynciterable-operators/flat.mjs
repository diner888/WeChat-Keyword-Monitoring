import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { flat } from '../../asynciterable/operators/flat';
/**
 * @ignore
 */
export function flatProto(depth = -1) {
    return flat(depth)(this);
}
AsyncIterableX.prototype.flat = flatProto;

//# sourceMappingURL=flat.mjs.map

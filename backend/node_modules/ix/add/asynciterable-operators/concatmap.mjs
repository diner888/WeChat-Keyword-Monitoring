import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { concatMap } from '../../asynciterable/operators/concatmap';
/**
 * @ignore
 */
export function concatMapProto(selector, thisArg) {
    return concatMap(selector, thisArg)(this);
}
AsyncIterableX.prototype.concatMap = concatMapProto;

//# sourceMappingURL=concatmap.mjs.map

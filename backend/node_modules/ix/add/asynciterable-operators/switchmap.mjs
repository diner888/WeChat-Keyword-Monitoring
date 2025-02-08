import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { switchMap } from '../../asynciterable/operators/switchmap';
/**
 * @ignore
 */
export function switchMapProto(selector, thisArg) {
    return switchMap(selector, thisArg)(this);
}
AsyncIterableX.prototype.switchMap = switchMapProto;

//# sourceMappingURL=switchmap.mjs.map

import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { FlattenConcurrentSelector } from '../../asynciterable/operators/_flatten';
/**
 * @ignore
 */
export declare function concatMapProto<T, R>(this: AsyncIterableX<T>, selector: FlattenConcurrentSelector<T, R>, thisArg?: any): AsyncIterableX<R>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        concatMap: typeof concatMapProto;
    }
}

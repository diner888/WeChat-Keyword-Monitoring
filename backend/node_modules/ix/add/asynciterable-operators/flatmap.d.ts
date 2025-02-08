import { AsyncIterableX } from '../../asynciterable/asynciterablex';
import { FlattenConcurrentSelector } from '../../asynciterable/operators/_flatten';
/**
 * @ignore
 */
export declare function flatMapProto<T, R>(this: AsyncIterableX<T>, selector: FlattenConcurrentSelector<T, R>, thisArg?: any): AsyncIterableX<R>;
declare module '../../asynciterable/asynciterablex' {
    interface AsyncIterableX<T> {
        flatMap: typeof flatMapProto;
    }
}

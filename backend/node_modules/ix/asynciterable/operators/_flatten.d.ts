import { AsyncIterableInput, AsyncIterableX } from '../asynciterablex';
export declare type FlattenConcurrentSelector<TSource, TResult> = (value: TSource, index: number, signal?: AbortSignal) => Promise<AsyncIterableInput<TResult>> | AsyncIterableInput<TResult>;
export declare class FlattenConcurrentAsyncIterable<TSource, TResult> extends AsyncIterableX<TResult> {
    private _source;
    private _selector;
    private _concurrent;
    private _switchMode;
    private _thisArg?;
    constructor(_source: AsyncIterable<TSource>, _selector: FlattenConcurrentSelector<TSource, TResult>, _concurrent: number, _switchMode: boolean, _thisArg?: any);
    [Symbol.asyncIterator](outerSignal?: AbortSignal): AsyncGenerator<Awaited<TResult>, void, unknown>;
}

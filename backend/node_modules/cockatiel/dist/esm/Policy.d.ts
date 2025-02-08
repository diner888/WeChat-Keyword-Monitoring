import { IBreaker } from './breaker/Breaker';
import { BulkheadPolicy } from './BulkheadPolicy';
import { CancellationToken } from './CancellationToken';
import { CircuitBreakerPolicy } from './CircuitBreakerPolicy';
import { Event } from './common/Event';
import { FallbackPolicy } from './FallbackPolicy';
import { IRetryContext, RetryPolicy } from './RetryPolicy';
import { ICancellationContext, TimeoutPolicy, TimeoutStrategy } from './TimeoutPolicy';
declare type Constructor<T> = new (...args: any) => T;
export interface IBasePolicyOptions {
    errorFilter: (error: Error) => boolean;
    resultFilter: (result: unknown) => boolean;
}
/**
 * The reason for a call failure. Either an error, or the a value that was
 * marked as a failure (when using result filtering).
 */
export declare type FailureReason<ReturnType> = {
    error: Error;
} | {
    value: ReturnType;
};
/**
 * Event emitted on the `onFailure` calls.
 */
export interface IFailureEvent {
    /**
     * Call duration, in milliseconds (with nanosecond precision, as the OS allows).
     */
    duration: number;
    /**
     * Whether the error was handled by the policy.
     */
    handled: boolean;
    /**
     * The reason for the error.
     */
    reason: FailureReason<unknown>;
}
/**
 * Event emitted on the `onSuccess` calls.
 */
export interface ISuccessEvent {
    /**
     * Call duration, in milliseconds (with nanosecond precision, as the OS allows).
     */
    duration: number;
}
export interface IDefaultPolicyContext {
    /**
     * Cancellation token for the operation. This is propagated through multiple
     * retry policies.
     */
    cancellationToken: CancellationToken;
}
/**
 * IPolicy is the type of all policies that Cockatiel provides. It describes
 * an execute() function which takes a generic argument.
 */
export interface IPolicy<ContextType extends IDefaultPolicyContext = IDefaultPolicyContext, AltReturn = never> {
    /**
     * Fires on the policy when a request successfully completes and some
     * successful value will be returned. In a retry policy, this is fired once
     * even if the request took multiple retries to succeed.
     */
    readonly onSuccess: Event<ISuccessEvent>;
    /**
     * Fires on the policy when a request fails *due to a handled reason* fails
     * and will give rejection to the called.
     */
    readonly onFailure: Event<IFailureEvent>;
    /**
     * Runs the function through behavior specified by the policy.
     */
    execute<T>(fn: (context: ContextType) => PromiseLike<T> | T, cancellationToken?: CancellationToken): Promise<T | AltReturn>;
}
declare type PolicyType<T> = T extends RetryPolicy ? IPolicy<IRetryContext, never> : T extends TimeoutPolicy ? IPolicy<ICancellationContext, never> : T extends FallbackPolicy<infer F> ? IPolicy<IRetryContext, F> : T extends CircuitBreakerPolicy ? IPolicy<IRetryContext, never> : T extends IPolicy<infer ContextType, infer ReturnType> ? IPolicy<ContextType, ReturnType> : never;
declare type MergePolicies<A, B> = A extends IPolicy<infer A1, infer A2> ? B extends IPolicy<infer B1, infer B2> ? IPolicy<A1 & B1, A2 | B2> : never : never;
/**
 * Factory that builds a base set of filters that can be used in circuit
 * breakers, retries, etc.
 */
export declare class Policy {
    private readonly options;
    /**
     * A no-op policy, useful for unit tests and stubs.
     */
    static readonly noop: IPolicy<any>;
    /**
     * Wraps the given set of policies into a single policy. For instance, this:
     *
     * ```js
     * retry.execute(() =>
     *  breaker.execute(() =>
     *    timeout.execute(({ cancellationToken }) => getData(cancellationToken))))
     * ```
     *
     * Is the equivalent to:
     *
     * ```js
     * Policy
     *  .wrap(retry, breaker, timeout)
     *  .execute(({ cancellationToken }) => getData(cancellationToken)));
     * ```
     *
     * The `context` argument passed to the executed function is the merged object
     * of all previous policies.
     *
     */
    static wrap<A extends IPolicy<IDefaultPolicyContext, unknown>>(p1: A): PolicyType<A>;
    static wrap<A extends IPolicy<IDefaultPolicyContext, unknown>, B extends IPolicy<IDefaultPolicyContext, unknown>>(p1: A, p2: B): MergePolicies<PolicyType<A>, PolicyType<B>>;
    static wrap<A extends IPolicy<IDefaultPolicyContext, unknown>, B extends IPolicy<IDefaultPolicyContext, unknown>, C extends IPolicy<IDefaultPolicyContext, unknown>>(p1: A, p2: B, p3: C): MergePolicies<PolicyType<C>, MergePolicies<PolicyType<A>, PolicyType<B>>>;
    static wrap<A extends IPolicy<IDefaultPolicyContext, unknown>, B extends IPolicy<IDefaultPolicyContext, unknown>, C extends IPolicy<IDefaultPolicyContext, unknown>, D extends IPolicy<IDefaultPolicyContext, unknown>>(p1: A, p2: B, p3: C, p4: D): MergePolicies<PolicyType<D>, MergePolicies<PolicyType<C>, MergePolicies<PolicyType<A>, PolicyType<B>>>>;
    static wrap<A extends IPolicy<IDefaultPolicyContext, unknown>, B extends IPolicy<IDefaultPolicyContext, unknown>, C extends IPolicy<IDefaultPolicyContext, unknown>, D extends IPolicy<IDefaultPolicyContext, unknown>, E extends IPolicy<IDefaultPolicyContext, unknown>>(p1: A, p2: B, p3: C, p4: D, p5: E): MergePolicies<PolicyType<E>, MergePolicies<PolicyType<D>, MergePolicies<PolicyType<C>, MergePolicies<PolicyType<A>, PolicyType<B>>>>>;
    static wrap<C extends IDefaultPolicyContext, A>(...p: Array<IPolicy<C, A>>): IPolicy<C, A>;
    /**
     * Creates a bulkhead--a policy that limits the number of concurrent calls.
     */
    static bulkhead(limit: number, queue?: number): BulkheadPolicy;
    /**
     * Creates a retry policy that handles all errors.
     */
    static handleAll(): Policy;
    /**
     * See {@link Policy.orType} for usage.
     */
    static handleType<T>(cls: Constructor<T>, predicate?: (error: T) => boolean): Policy;
    /**
     * See {@link Policy.orWhen} for usage.
     */
    static handleWhen(predicate: (error: Error) => boolean): Policy;
    /**
     * See {@link Policy.orResultType} for usage.
     */
    static handleResultType<T>(cls: Constructor<T>, predicate?: (error: T) => boolean): Policy;
    /**
     * See {@link Policy.orWhenResult} for usage.
     */
    static handleWhenResult(predicate: (error: unknown) => boolean): Policy;
    /**
     * Creates a timeout policy.
     * @param duration - How long to wait before timing out execute()'d functions
     * @param strategy - Strategy for timeouts, "Cooperative" or "Aggressive".
     * A {@link CancellationToken} will be pass to any executed function, and in
     * cooperative timeouts we'll simply wait for that function to return or
     * throw. In aggressive timeouts, we'll immediately throw a
     * {@link TaskCancelledError} when the timeout is reached, in addition to
     * marking the passed token as failed.
     */
    static timeout(duration: number, strategy: TimeoutStrategy): TimeoutPolicy;
    /**
     * A decorator that can be used to wrap class methods and apply the given
     * policy to them. It also adds the last argument normally given in
     * {@link Policy.execute} as the last argument in the function call.
     * For example:
     *
     * ```ts
     * import { Policy } from 'cockatiel';
     *
     * const retry = Policy.handleAll().retry().attempts(3);
     *
     * class Database {
     *   @Policy.use(retry)
     *   public getUserInfo(userId, context, cancellationToken) {
     *     console.log('Retry attempt number', context.attempt);
     *     // implementation here
     *   }
     * }
     *
     * const db = new Database();
     * db.getUserInfo(3).then(info => console.log('User 3 info:', info))
     * ```
     *
     * Note that it will force the return type to be a Promise, since that's
     * what policies return.
     */
    static use(policy: IPolicy<IDefaultPolicyContext, never>): (_target: unknown, _key: string, descriptor: PropertyDescriptor) => void;
    protected constructor(options: Readonly<IBasePolicyOptions>);
    /**
     * Allows the policy to additionally handles errors of the given type.
     *
     * @param cls Class constructor to check that the error is an instance of.
     * @param predicate If provided, a function to be called with the error
     * which should return "true" if we want to handle this error.
     * @example
     * ```js
     * // retry both network errors and response errors with a 503 status code
     * new Policy()
     *  .orType(NetworkError)
     *  .orType(ResponseError, err => err.statusCode === 503)
     *  .retry()
     *  .attempts(3)
     *  .execute(() => getJsonFrom('https://example.com'));
     * ```
     */
    orType<T>(cls: Constructor<T>, predicate?: (error: T) => boolean): Policy;
    /**
     * Allows the policy to additionally handles errors that pass the given
     * predicate function.
     *
     * @param predicate Takes any thrown error, and returns true if it should
     * be retried by this policy.
     * @example
     * ```js
     * // only retry if the error has a "shouldBeRetried" property set
     * new Policy()
     *  .orWhen(err => err.shouldBeRetried === true)
     *  .retry()
     *  .attempts(3)
     *  .execute(() => getJsonFrom('https://example.com'));
     * ```
     */
    orWhen(predicate: (error: Error) => boolean): Policy;
    /**
     * Adds handling for return values. The predicate will be called with
     * the return value of the executed function,
     *
     * @param predicate Takes the returned value, and returns true if it
     * should be retried by this policy.
     * @example
     * ```js
     * // retry when the response status code is a 5xx
     * new Policy()
     *  .orResultWhen(res => res.statusCode >= 500)
     *  .retry()
     *  .attempts(3)
     *  .execute(() => getJsonFrom('https://example.com'));
     * ```
     */
    orWhenResult(predicate: (r: unknown) => boolean): Policy;
    /**
     * Adds handling for return values. The predicate will be called with
     * the return value of the executed function,
     *
     * @param predicate Takes the returned value, and returns true if it
     * should be retried by this policy.
     * @example
     * ```js
     * // retry when the response status code is a 5xx
     * new Policy()
     *  .orResultType(res => res.statusCode >= 500)
     *  .retry()
     *  .attempts(3)
     *  .execute(() => getJsonFrom('https://example.com'));
     * ```
     */
    orResultType<T>(cls: Constructor<T>, predicate?: (error: T) => boolean): Policy;
    /**
     * Returns a retry policy builder.
     */
    retry(): RetryPolicy;
    /**
     * Returns a circuit breaker for the policy. **Important**: you should share
     * your circuit breaker between executions of whatever function you're
     * wrapping for it to function!
     *
     * ```ts
     * import { SamplingBreaker, Policy } from 'cockatiel';
     *
     * // Break if more than 20% of requests fail in a 30 second time window:
     * const breaker = Policy
     *  .handleAll()
     *  .circuitBreaker(10_000, new SamplingBreaker(0.2, 30 * 1000));
     *
     * export function handleRequest() {
     *   return breaker.execute(() => getInfoFromDatabase());
     * }
     * ```
     *
     * @param halfOpenAfter Time after failures to try to open the circuit
     * breaker again.
     * @param breaker The circuit breaker to use. This package exports
     * ConsecutiveBreaker and SamplingBreakers for you to use.
     */
    circuitBreaker(halfOpenAfter: number, breaker: IBreaker): CircuitBreakerPolicy;
    /**
     * Falls back to the given value in the event of an error.
     *
     * ```ts
     * import { Policy } from 'cockatiel';
     *
     * const fallback = Policy
     *  .handleType(DatabaseError)
     *  .fallback(() => getStaleData());
     *
     * export function handleRequest() {
     *   return fallback.execute(() => getInfoFromDatabase());
     * }
     * ```
     *
     * @param toValue Value to fall back to, or a function that creates the
     * value to return (any may return a promise)
     */
    fallback<R>(valueOrFactory: (() => Promise<R> | R) | R): FallbackPolicy<R>;
}
export {};

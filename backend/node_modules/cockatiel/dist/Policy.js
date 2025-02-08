"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BulkheadPolicy_1 = require("./BulkheadPolicy");
const CancellationToken_1 = require("./CancellationToken");
const CircuitBreakerPolicy_1 = require("./CircuitBreakerPolicy");
const Executor_1 = require("./common/Executor");
const FallbackPolicy_1 = require("./FallbackPolicy");
const NoopPolicy_1 = require("./NoopPolicy");
const RetryPolicy_1 = require("./RetryPolicy");
const TimeoutPolicy_1 = require("./TimeoutPolicy");
const typeFilter = (cls, predicate) => predicate ? (v) => v instanceof cls && predicate(v) : (v) => v instanceof cls;
const always = () => true;
const never = () => false;
/**
 * Factory that builds a base set of filters that can be used in circuit
 * breakers, retries, etc.
 */
class Policy {
    constructor(options) {
        this.options = options;
    }
    static wrap(...p) {
        return {
            onFailure: p[0].onFailure,
            onSuccess: p[0].onSuccess,
            execute(fn, cancellationToken) {
                const run = (context, i) => i === p.length
                    ? fn(context)
                    : p[i].execute(next => run({ ...context, ...next }, i + 1), context.cancellationToken);
                return Promise.resolve(run({ cancellationToken }, 0));
            },
        };
    }
    /**
     * Creates a bulkhead--a policy that limits the number of concurrent calls.
     */
    static bulkhead(limit, queue = 0) {
        return new BulkheadPolicy_1.BulkheadPolicy(limit, queue);
    }
    /**
     * Creates a retry policy that handles all errors.
     */
    static handleAll() {
        return new Policy({ errorFilter: always, resultFilter: never });
    }
    /**
     * See {@link Policy.orType} for usage.
     */
    static handleType(cls, predicate) {
        return new Policy({ errorFilter: typeFilter(cls, predicate), resultFilter: never });
    }
    /**
     * See {@link Policy.orWhen} for usage.
     */
    static handleWhen(predicate) {
        return new Policy({ errorFilter: predicate, resultFilter: never });
    }
    /**
     * See {@link Policy.orResultType} for usage.
     */
    static handleResultType(cls, predicate) {
        return new Policy({ errorFilter: never, resultFilter: typeFilter(cls, predicate) });
    }
    /**
     * See {@link Policy.orWhenResult} for usage.
     */
    static handleWhenResult(predicate) {
        return new Policy({ errorFilter: never, resultFilter: predicate });
    }
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
    static timeout(duration, strategy) {
        return new TimeoutPolicy_1.TimeoutPolicy(duration, strategy);
    }
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
    static use(policy) {
        // tslint:disable-next-line: variable-name
        return (_target, _key, descriptor) => {
            const inner = descriptor.value;
            if (typeof inner !== 'function') {
                throw new Error(`Can only decorate functions with @cockatiel, got ${typeof inner}`);
            }
            descriptor.value = function (...args) {
                const ct = args[args.length - 1] instanceof CancellationToken_1.CancellationToken ? args.pop() : undefined;
                return policy.execute(context => inner.apply(this, [...args, context]), ct);
            };
        };
    }
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
    orType(cls, predicate) {
        const filter = typeFilter(cls, predicate);
        return new Policy({
            ...this.options,
            errorFilter: e => this.options.errorFilter(e) || filter(e),
        });
    }
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
    orWhen(predicate) {
        return new Policy({
            ...this.options,
            errorFilter: e => this.options.errorFilter(e) || predicate(e),
        });
    }
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
    orWhenResult(predicate) {
        return new Policy({
            ...this.options,
            resultFilter: r => this.options.resultFilter(r) || predicate(r),
        });
    }
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
    orResultType(cls, predicate) {
        const filter = typeFilter(cls, predicate);
        return new Policy({
            ...this.options,
            resultFilter: r => this.options.resultFilter(r) || filter(r),
        });
    }
    /**
     * Returns a retry policy builder.
     */
    retry() {
        return new RetryPolicy_1.RetryPolicy({}, new Executor_1.ExecuteWrapper(this.options.errorFilter, this.options.resultFilter));
    }
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
    circuitBreaker(halfOpenAfter, breaker) {
        return new CircuitBreakerPolicy_1.CircuitBreakerPolicy({
            breaker,
            halfOpenAfter,
        }, new Executor_1.ExecuteWrapper(this.options.errorFilter, this.options.resultFilter));
    }
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
    fallback(valueOrFactory) {
        return new FallbackPolicy_1.FallbackPolicy(new Executor_1.ExecuteWrapper(this.options.errorFilter, this.options.resultFilter), 
        // not technically type-safe, since if they actually want to _return_
        // a function, that gets lost here. We'll just advice in the docs to
        // use a higher-order function if necessary.
        (typeof valueOrFactory === 'function' ? valueOrFactory : () => valueOrFactory));
    }
}
exports.Policy = Policy;
/**
 * A no-op policy, useful for unit tests and stubs.
 */
Policy.noop = new NoopPolicy_1.NoopPolicy();
//# sourceMappingURL=Policy.js.map
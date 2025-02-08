/**
 * Exception thrown from {@link CircuitBreakerPolicy.execute} when the
 * circuit breaker is open.
 */
export declare class BrokenCircuitError extends Error {
    readonly isBrokenCircuitError = true;
    constructor(message?: string);
}

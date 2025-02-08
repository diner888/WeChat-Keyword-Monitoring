import { BrokenCircuitError } from './BrokenCircuitError';
/**
 * Exception thrown from {@link CircuitBreakerPolicy.execute} when the
 * circuit breaker is open.
 */
export declare class IsolatedCircuitError extends BrokenCircuitError {
    readonly isIsolatedCircuitError = true;
    constructor();
}

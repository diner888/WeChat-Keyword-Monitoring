/**
 * Exception thrown from {@link CircuitBreakerPolicy.execute} when the
 * circuit breaker is open.
 */
export class BrokenCircuitError extends Error {
    constructor(message = 'Execution prevented because the circuit breaker is open') {
        super(message);
        this.isBrokenCircuitError = true;
    }
}
//# sourceMappingURL=BrokenCircuitError.js.map
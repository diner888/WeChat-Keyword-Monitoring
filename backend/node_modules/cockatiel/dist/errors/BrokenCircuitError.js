"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Exception thrown from {@link CircuitBreakerPolicy.execute} when the
 * circuit breaker is open.
 */
class BrokenCircuitError extends Error {
    constructor(message = 'Execution prevented because the circuit breaker is open') {
        super(message);
        this.isBrokenCircuitError = true;
    }
}
exports.BrokenCircuitError = BrokenCircuitError;
//# sourceMappingURL=BrokenCircuitError.js.map
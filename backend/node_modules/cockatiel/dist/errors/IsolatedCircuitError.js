"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BrokenCircuitError_1 = require("./BrokenCircuitError");
/**
 * Exception thrown from {@link CircuitBreakerPolicy.execute} when the
 * circuit breaker is open.
 */
class IsolatedCircuitError extends BrokenCircuitError_1.BrokenCircuitError {
    constructor() {
        super(`Execution prevented because the circuit breaker is open`);
        this.isIsolatedCircuitError = true;
    }
}
exports.IsolatedCircuitError = IsolatedCircuitError;
//# sourceMappingURL=IsolatedCircuitError.js.map
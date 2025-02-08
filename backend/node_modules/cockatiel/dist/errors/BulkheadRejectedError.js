"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BulkheadRejectedError extends Error {
    constructor(executionSlots, queueSlots) {
        super(`Bulkhead capacity exceeded (0/${executionSlots} execution slots, 0/${queueSlots} available)`);
        this.isBulkheadRejectedError = true;
    }
}
exports.BulkheadRejectedError = BulkheadRejectedError;
//# sourceMappingURL=BulkheadRejectedError.js.map
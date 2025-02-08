"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * ConsecutiveBreaker breaks if more than `threshold` exceptions are received
 * over a time period.
 */
class ConsecutiveBreaker {
    constructor(threshold) {
        this.threshold = threshold;
        this.count = 0;
    }
    /**
     * @inheritdoc
     */
    success() {
        this.count = 0;
    }
    /**
     * @inheritdoc
     */
    failure() {
        return ++this.count >= this.threshold;
    }
}
exports.ConsecutiveBreaker = ConsecutiveBreaker;
//# sourceMappingURL=ConsecutiveBreaker.js.map
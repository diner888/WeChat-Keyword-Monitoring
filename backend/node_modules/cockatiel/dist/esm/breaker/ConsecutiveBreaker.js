/**
 * ConsecutiveBreaker breaks if more than `threshold` exceptions are received
 * over a time period.
 */
export class ConsecutiveBreaker {
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
//# sourceMappingURL=ConsecutiveBreaker.js.map
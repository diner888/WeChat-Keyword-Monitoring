import { IBreaker } from './Breaker';
/**
 * ConsecutiveBreaker breaks if more than `threshold` exceptions are received
 * over a time period.
 */
export declare class ConsecutiveBreaker implements IBreaker {
    private readonly threshold;
    private count;
    constructor(threshold: number);
    /**
     * @inheritdoc
     */
    success(): void;
    /**
     * @inheritdoc
     */
    failure(): boolean;
}

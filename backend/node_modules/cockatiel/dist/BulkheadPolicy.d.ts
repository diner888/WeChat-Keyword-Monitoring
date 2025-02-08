import { CancellationToken } from './CancellationToken';
import { IDefaultPolicyContext, IPolicy } from './Policy';
/**
 * Bulkhead limits concurrent requests made.
 */
export declare class BulkheadPolicy implements IPolicy {
    private readonly capacity;
    private readonly queueCapacity;
    private active;
    private readonly queue;
    private readonly onRejectEmitter;
    private readonly executor;
    /**
     * @inheritdoc
     */
    readonly onSuccess: import("./common/Event").Event<import("./Policy").ISuccessEvent>;
    /**
     * @inheritdoc
     */
    readonly onFailure: import("./common/Event").Event<import("./Policy").IFailureEvent>;
    /**
     * Emitter that fires when an item is rejected from the bulkhead.
     */
    readonly onReject: import("./common/Event").Event<void>;
    /**
     * Returns the number of available execution slots at this point in time.
     */
    get executionSlots(): number;
    /**
     * Returns the number of queue slots at this point in time.
     */
    get queueSlots(): number;
    constructor(capacity: number, queueCapacity: number);
    /**
     * Executes the given function.
     * @param fn Function to execute
     * @throws a {@link BulkheadRejectedException} if the bulkhead limits are exceeeded
     */
    execute<T>(fn: (context: IDefaultPolicyContext) => PromiseLike<T> | T, cancellationToken?: CancellationToken): Promise<T>;
    private dequeue;
}

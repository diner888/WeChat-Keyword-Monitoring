import { CancellationToken } from './CancellationToken';
import { defer } from './common/defer';
import { EventEmitter } from './common/Event';
import { ExecuteWrapper } from './common/Executor';
import { BulkheadRejectedError } from './errors/BulkheadRejectedError';
import { TaskCancelledError } from './errors/Errors';
/**
 * Bulkhead limits concurrent requests made.
 */
export class BulkheadPolicy {
    constructor(capacity, queueCapacity) {
        this.capacity = capacity;
        this.queueCapacity = queueCapacity;
        this.active = 0;
        this.queue = [];
        this.onRejectEmitter = new EventEmitter();
        this.executor = new ExecuteWrapper();
        /**
         * @inheritdoc
         */
        // tslint:disable-next-line: member-ordering
        this.onSuccess = this.executor.onSuccess;
        /**
         * @inheritdoc
         */
        // tslint:disable-next-line: member-ordering
        this.onFailure = this.executor.onFailure;
        /**
         * Emitter that fires when an item is rejected from the bulkhead.
         */
        // tslint:disable-next-line: member-ordering
        this.onReject = this.onRejectEmitter.addListener;
    }
    /**
     * Returns the number of available execution slots at this point in time.
     */
    get executionSlots() {
        return this.capacity - this.active;
    }
    /**
     * Returns the number of queue slots at this point in time.
     */
    get queueSlots() {
        return this.queueCapacity - this.queue.length;
    }
    /**
     * Executes the given function.
     * @param fn Function to execute
     * @throws a {@link BulkheadRejectedException} if the bulkhead limits are exceeeded
     */
    async execute(fn, cancellationToken = CancellationToken.None) {
        if (cancellationToken.isCancellationRequested) {
            throw new TaskCancelledError();
        }
        if (this.active < this.capacity) {
            this.active++;
            try {
                return await fn({ cancellationToken });
            }
            finally {
                this.active--;
                this.dequeue();
            }
        }
        if (this.queue.length < this.queueCapacity) {
            const { resolve, reject, promise } = defer();
            this.queue.push({ ct: cancellationToken, fn, resolve, reject });
            return promise;
        }
        this.onRejectEmitter.emit();
        throw new BulkheadRejectedError(this.capacity, this.queueCapacity);
    }
    dequeue() {
        const item = this.queue.shift();
        if (!item) {
            return;
        }
        Promise.resolve()
            .then(() => this.execute(item.fn, item.ct))
            .then(item.resolve)
            .catch(item.reject);
    }
}
//# sourceMappingURL=BulkheadPolicy.js.map
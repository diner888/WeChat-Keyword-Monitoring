import { Event, MemorizingEventEmitter, noopDisposable } from './common/Event';
/**
 * Source that creates {@link CancellationToken} instances/
 */
export class CancellationTokenSource {
    constructor(parent) {
        this.onCancel = new MemorizingEventEmitter();
        /**
         * Gets the cancellation token for this source.
         */
        // tslint:disable-next-line: member-ordering
        this.token = new CancellationToken(this.onCancel.addListener);
        if (parent) {
            this.parentListener = parent.onCancellationRequested(() => this.cancel());
        }
    }
    /**
     * Cancels associated tokens.
     */
    cancel() {
        if (this.parentListener) {
            this.parentListener.dispose();
            this.parentListener = undefined;
        }
        if (!this.onCancel.hasEmitted) {
            this.onCancel.emit();
        }
    }
}
/**
 * Implementation of a cancellation token. Exposes several methods that can
 * be used to implement cooperative cancellation.
 */
export class CancellationToken {
    /**
     * Creates a new cancellation token that is marked as cancelled once the
     * callback fires.
     */
    constructor(onCancellationRequested) {
        this.onCancellationRequested = onCancellationRequested;
        this.isRequested = false;
        Event.once(onCancellationRequested, () => (this.isRequested = true));
    }
    /**
     * Returns whether cancellation has been requested.
     */
    get isCancellationRequested() {
        return this.isRequested;
    }
    /**
     * Returns a promise that resolves once cancellation is requested.
     */
    cancellation(listenerCancellation) {
        return Event.toPromise(this.onCancellationRequested, listenerCancellation);
    }
}
/**
 * A cancellation token which is never cancelled.
 */
CancellationToken.None = new CancellationToken(() => noopDisposable);
/**
 * A cancellation token which is immediately/already cancelled.
 */
CancellationToken.Cancelled = new CancellationToken(listener => {
    listener(undefined);
    return noopDisposable;
});
//# sourceMappingURL=CancellationToken.js.map
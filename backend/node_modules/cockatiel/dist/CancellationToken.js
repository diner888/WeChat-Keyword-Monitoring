"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = require("./common/Event");
/**
 * Source that creates {@link CancellationToken} instances/
 */
class CancellationTokenSource {
    constructor(parent) {
        this.onCancel = new Event_1.MemorizingEventEmitter();
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
exports.CancellationTokenSource = CancellationTokenSource;
/**
 * Implementation of a cancellation token. Exposes several methods that can
 * be used to implement cooperative cancellation.
 */
class CancellationToken {
    /**
     * Creates a new cancellation token that is marked as cancelled once the
     * callback fires.
     */
    constructor(onCancellationRequested) {
        this.onCancellationRequested = onCancellationRequested;
        this.isRequested = false;
        Event_1.Event.once(onCancellationRequested, () => (this.isRequested = true));
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
        return Event_1.Event.toPromise(this.onCancellationRequested, listenerCancellation);
    }
}
exports.CancellationToken = CancellationToken;
/**
 * A cancellation token which is never cancelled.
 */
CancellationToken.None = new CancellationToken(() => Event_1.noopDisposable);
/**
 * A cancellation token which is immediately/already cancelled.
 */
CancellationToken.Cancelled = new CancellationToken(listener => {
    listener(undefined);
    return Event_1.noopDisposable;
});
//# sourceMappingURL=CancellationToken.js.map
import { Event } from './common/Event';
/**
 * Source that creates {@link CancellationToken} instances/
 */
export declare class CancellationTokenSource {
    private readonly onCancel;
    private parentListener?;
    constructor(parent?: CancellationToken);
    /**
     * Gets the cancellation token for this source.
     */
    readonly token: CancellationToken;
    /**
     * Cancels associated tokens.
     */
    cancel(): void;
}
/**
 * Implementation of a cancellation token. Exposes several methods that can
 * be used to implement cooperative cancellation.
 */
export declare class CancellationToken {
    readonly onCancellationRequested: Event<void>;
    /**
     * A cancellation token which is never cancelled.
     */
    static None: CancellationToken;
    /**
     * A cancellation token which is immediately/already cancelled.
     */
    static Cancelled: CancellationToken;
    private isRequested;
    /**
     * Creates a new cancellation token that is marked as cancelled once the
     * callback fires.
     */
    constructor(onCancellationRequested: Event<void>);
    /**
     * Returns whether cancellation has been requested.
     */
    get isCancellationRequested(): boolean;
    /**
     * Returns a promise that resolves once cancellation is requested.
     */
    cancellation(listenerCancellation?: CancellationToken): Promise<void>;
}

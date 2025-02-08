/**
 * Error thrown when a task is cancelled.
 */
export declare class TaskCancelledError extends Error {
    readonly message: string;
    readonly isTaskCancelledError = true;
    constructor(message?: string);
}

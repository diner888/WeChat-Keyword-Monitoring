/**
 * Error thrown when a task is cancelled.
 */
export class TaskCancelledError extends Error {
    constructor(message = 'Operation cancelled') {
        super(message);
        this.message = message;
        this.isTaskCancelledError = true;
    }
}
//# sourceMappingURL=TaskCancelledError.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Error thrown when a task is cancelled.
 */
class TaskCancelledError extends Error {
    constructor(message = 'Operation cancelled') {
        super(message);
        this.message = message;
        this.isTaskCancelledError = true;
    }
}
exports.TaskCancelledError = TaskCancelledError;
//# sourceMappingURL=TaskCancelledError.js.map
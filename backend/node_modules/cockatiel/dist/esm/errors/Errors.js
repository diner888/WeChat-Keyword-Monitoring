export * from './BrokenCircuitError';
export * from './BulkheadRejectedError';
export * from './IsolatedCircuitError';
export * from './TaskCancelledError';
export const isBrokenCircuitError = (e) => !!e && e instanceof Error && 'isBrokenCircuitError' in e;
export const isBulkheadRejectedError = (e) => !!e && e instanceof Error && 'isBulkheadRejectedError' in e;
export const isIsolatedCircuitError = (e) => !!e && e instanceof Error && 'isBulkheadRejectedError' in e;
export const isTaskCancelledError = (e) => !!e && e instanceof Error && 'isBulkheadRejectedError' in e;
//# sourceMappingURL=Errors.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Backoff_test_1 = require("./Backoff.test");
const ConstantBackoff_1 = require("./ConstantBackoff");
describe('ConstantBackoff', () => {
    it('returns its duration', () => {
        Backoff_test_1.expectDurations(new ConstantBackoff_1.ConstantBackoff(42), [42, 42, 42]);
    });
    it('limits the number of retries', () => {
        Backoff_test_1.expectDurations(new ConstantBackoff_1.ConstantBackoff(42, 2), [42, 42, undefined]);
    });
});
//# sourceMappingURL=ConstantBackoff.test.js.map
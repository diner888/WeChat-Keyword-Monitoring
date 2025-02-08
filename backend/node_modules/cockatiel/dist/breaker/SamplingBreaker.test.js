"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon_1 = require("sinon");
const CircuitBreakerPolicy_1 = require("../CircuitBreakerPolicy");
const SamplingBreaker_1 = require("./SamplingBreaker");
chai_1.use(require('chai-subset'));
const getState = (b) => {
    const untyped = b;
    return {
        threshold: untyped.threshold,
        minimumRpms: untyped.minimumRpms,
        duration: untyped.duration,
        windowSize: untyped.windowSize,
        windows: untyped.windows.map((w) => ({ ...w })),
        currentWindow: untyped.currentWindow,
        currentFailures: untyped.currentFailures,
        currentSuccesses: untyped.currentSuccesses,
    };
};
describe('SamplingBreaker', () => {
    describe('parameter creation', () => {
        it('rejects if threshold out of range', () => {
            chai_1.expect(() => new SamplingBreaker_1.SamplingBreaker({ threshold: -1, duration: 10 })).to.throw(RangeError);
            chai_1.expect(() => new SamplingBreaker_1.SamplingBreaker({ threshold: 0, duration: 10 })).to.throw(RangeError);
            chai_1.expect(() => new SamplingBreaker_1.SamplingBreaker({ threshold: 1, duration: 10 })).to.throw(RangeError);
            chai_1.expect(() => new SamplingBreaker_1.SamplingBreaker({ threshold: 10, duration: 10 })).to.throw(RangeError);
        });
        it('creates good initial params', () => {
            const b = new SamplingBreaker_1.SamplingBreaker({ threshold: 0.2, duration: 10000, minimumRps: 5 });
            chai_1.expect(getState(b)).to.containSubset({
                threshold: 0.2,
                duration: 10000,
                minimumRpms: 5 / 1000,
                windowSize: 1000,
            });
            chai_1.expect(getState(b).windows).to.have.lengthOf(10);
        });
        it('creates initial params for small durations', () => {
            const b = new SamplingBreaker_1.SamplingBreaker({ threshold: 0.2, duration: 103, minimumRps: 5 });
            chai_1.expect(getState(b)).to.containSubset({
                threshold: 0.2,
                duration: 105,
                minimumRpms: 5 / 1000,
                windowSize: 21,
            });
            chai_1.expect(getState(b).windows).to.have.lengthOf(5);
        });
        it('creates guess for rpms', () => {
            const b1 = new SamplingBreaker_1.SamplingBreaker({ threshold: 0.2, duration: 103 });
            // needs at least 5 failures/sec, threshold of 0.2 means 5 * 5 total req/s
            chai_1.expect(getState(b1).minimumRpms).to.equal(25 / 1000);
            const b2 = new SamplingBreaker_1.SamplingBreaker({ threshold: 0.25, duration: 103 });
            // 5 * 4 here
            chai_1.expect(getState(b2).minimumRpms).to.equal(20 / 1000);
        });
    });
    describe('windowing', () => {
        let b;
        let clock;
        beforeEach(() => {
            b = new SamplingBreaker_1.SamplingBreaker({ threshold: 0.5, duration: 5000, minimumRps: 3 });
            clock = sinon_1.useFakeTimers();
        });
        afterEach(() => {
            clock.restore();
        });
        it('increments and wraps buckets correctly', () => {
            for (let i = 0; i < 7; i++) {
                for (let k = 0; k < i; k++) {
                    b.failure(CircuitBreakerPolicy_1.CircuitState.Closed);
                    b.success(CircuitBreakerPolicy_1.CircuitState.Closed);
                    b.success(CircuitBreakerPolicy_1.CircuitState.Closed);
                }
                clock.tick(1000);
            }
            chai_1.expect(getState(b)).to.containSubset({
                currentFailures: 20,
                currentSuccesses: 40,
                currentWindow: 1,
            });
            chai_1.expect(getState(b).windows).to.deep.equal([
                { failures: 5, successes: 10, startedAt: 5000 },
                { failures: 6, successes: 12, startedAt: 6000 },
                { failures: 2, successes: 4, startedAt: 2000 },
                { failures: 3, successes: 6, startedAt: 3000 },
                { failures: 4, successes: 8, startedAt: 4000 },
            ]);
        });
    });
    describe('functionality', () => {
        let b;
        let clock;
        const createTestBreaker = () => (b = new SamplingBreaker_1.SamplingBreaker({ threshold: 0.5, duration: 5000, minimumRps: 3 }));
        beforeEach(() => {
            createTestBreaker();
            clock = sinon_1.useFakeTimers();
        });
        afterEach(() => {
            clock.restore();
        });
        it('does not start failing if below threshold rps', () => {
            for (let i = 0; i < 10; i++) {
                chai_1.expect(b.failure(CircuitBreakerPolicy_1.CircuitState.Closed)).to.be.false;
                clock.tick(500); // advancing 0.5s each, never hits 3rps
            }
        });
        it('fails once above rps', () => {
            for (let i = 0; i < 3 * 5; i++) {
                clock.tick(334);
                chai_1.expect(b.failure(CircuitBreakerPolicy_1.CircuitState.Closed)).to.be.false;
            }
            b.failure(CircuitBreakerPolicy_1.CircuitState.Closed);
            // need one extra due to bucket approximation:
            chai_1.expect(b.failure(CircuitBreakerPolicy_1.CircuitState.Closed)).to.be.true;
        });
        it('calculates rps correctly over time', () => {
            // keep us right on the edge of closing (50% failure rate) for amounts of
            // time, and verify that adding another failure
            // right after each opens the circuit
            for (let runLength = 10; runLength < 20; runLength++) {
                createTestBreaker();
                for (let i = 0; i < runLength; i++) {
                    b.success(CircuitBreakerPolicy_1.CircuitState.Closed);
                    chai_1.expect(b.failure(CircuitBreakerPolicy_1.CircuitState.Closed)).to.be.false;
                    clock.tick(250);
                }
                chai_1.expect(b.failure(CircuitBreakerPolicy_1.CircuitState.Closed)).to.be.true;
            }
        });
        it('resets when recoving from a half-open', () => {
            for (let i = 0; i < 10; i++) {
                b.failure(CircuitBreakerPolicy_1.CircuitState.Closed);
            }
            b.success(CircuitBreakerPolicy_1.CircuitState.HalfOpen);
            chai_1.expect(getState(b).currentFailures).to.equal(0);
            chai_1.expect(b.failure(CircuitBreakerPolicy_1.CircuitState.Closed)).to.be.false;
        });
    });
});
//# sourceMappingURL=SamplingBreaker.test.js.map
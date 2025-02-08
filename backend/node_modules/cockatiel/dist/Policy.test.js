"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon_1 = require("sinon");
const Breaker_1 = require("./breaker/Breaker");
const CancellationToken_1 = require("./CancellationToken");
const Errors_1 = require("./errors/Errors");
const Policy_1 = require("./Policy");
const TimeoutPolicy_1 = require("./TimeoutPolicy");
class MyError1 extends Error {
}
class MyError2 extends Error {
}
class MyError3 extends Error {
}
// tslint:disable-next-line: variable-name
const assertNever = (_value) => {
    throw new Error('unreachable');
};
describe('Policy', () => {
    it('wraps', async () => {
        const policy = Policy_1.Policy.wrap(Policy_1.Policy.handleType(MyError1).retry().attempts(3), Policy_1.Policy.handleAll().circuitBreaker(100, new Breaker_1.ConsecutiveBreaker(2)));
        // should retry and break the circuit
        await chai_1.expect(policy.execute(sinon_1.stub().throws(new MyError1()))).to.be.rejectedWith(Errors_1.BrokenCircuitError);
    });
    it('wraps and keeps correct types', async () => {
        const policy = Policy_1.Policy.wrap(Policy_1.Policy.handleAll().retry(), Policy_1.Policy.handleAll().circuitBreaker(100, new Breaker_1.ConsecutiveBreaker(2)), Policy_1.Policy.handleAll().fallback('foo'), Policy_1.Policy.timeout(1000, TimeoutPolicy_1.TimeoutStrategy.Aggressive), Policy_1.Policy.noop);
        const result = await policy.execute(context => {
            chai_1.expect(context.cancellation).to.be.an.instanceOf(CancellationToken_1.CancellationToken);
            chai_1.expect(context.attempt).to.equal(0);
            return 1234;
        });
        switch (typeof result) {
            case 'string':
                result.toUpperCase();
                break;
            case 'number':
                Math.pow(result, 2);
                break;
            default:
                assertNever(result);
        }
    });
    it('applies error filters', async () => {
        const fn = sinon_1.stub()
            .onCall(0)
            .throws(new MyError1())
            .onCall(1)
            .throws(new MyError2())
            .onCall(2)
            .throws(new MyError3('foo'))
            .onCall(3)
            .throws(new Error('potato'))
            .onCall(4)
            .throws(new MyError3('bar'));
        await chai_1.expect(Policy_1.Policy.handleType(MyError1)
            .orType(MyError2)
            .orType(MyError3, e => e.message === 'foo')
            .orWhen(e => e.message === 'potato')
            .retry()
            .attempts(10)
            .execute(fn)).to.be.rejectedWith(MyError3, 'bar');
        chai_1.expect(fn).to.have.callCount(5);
    });
    it('applies result filters', async () => {
        const fn = sinon_1.stub()
            .onCall(0)
            .returns(new MyError1())
            .onCall(1)
            .returns(new MyError2())
            .onCall(2)
            .returns(new MyError3('foo'))
            .onCall(3)
            .returns('potato')
            .onCall(4)
            .returns('ok!');
        chai_1.expect(await Policy_1.Policy.handleResultType(MyError1)
            .orResultType(MyError2)
            .orResultType(MyError3, e => e.message === 'foo')
            .orWhenResult(e => e === 'potato')
            .retry()
            .attempts(10)
            .execute(fn)).to.equal('ok!');
        chai_1.expect(fn).to.have.callCount(5);
    });
    it('applies Policy.use', async () => {
        class Calculator {
            double(n, context) {
                if (context.attempt < 2) {
                    throw new Error('failed');
                }
                return { n: n * 2, ...context };
            }
        }
        __decorate([
            Policy_1.Policy.use(Policy_1.Policy.handleAll().retry().attempts(5))
        ], Calculator.prototype, "double", null);
        const c = new Calculator();
        // @ts-ignore
        const r = await c.double(2);
        chai_1.expect(r).to.deep.equal({
            n: 4,
            cancellationToken: r.cancellationToken,
            attempt: 2,
        });
    });
    it('uses cancellation token in Policy.use', async () => {
        class Calculator {
            double(n, context) {
                chai_1.expect(n).to.equal(2);
                chai_1.expect(context.cancellationToken.isCancellationRequested).to.be.false;
                cts.cancel();
                chai_1.expect(context.cancellationToken.isCancellationRequested).to.be.true;
                return n * 2;
            }
        }
        __decorate([
            Policy_1.Policy.use(Policy_1.Policy.handleAll().retry().attempts(5))
        ], Calculator.prototype, "double", null);
        const cts = new CancellationToken_1.CancellationTokenSource();
        const c = new Calculator();
        // @ts-ignore
        chai_1.expect(await c.double(2, cts.token)).to.equal(4);
    });
});
//# sourceMappingURL=Policy.test.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon_1 = require("sinon");
const CancellationToken_1 = require("./CancellationToken");
const Policy_1 = require("./Policy");
describe('FallbackPolicy', () => {
    it('does not fall back when not necessary', async () => {
        const result = await Policy_1.Policy.handleAll()
            .fallback('error')
            .execute(() => 'ok');
        chai_1.expect(result).to.equal('ok');
    });
    it('returns a fallback and emits an error if necessary', async () => {
        var _a;
        const policy = await Policy_1.Policy.handleAll().fallback('error');
        const onFallback = sinon_1.stub();
        policy.onFailure(onFallback);
        const error = new Error('oh no!');
        const result = await policy.execute(() => {
            throw error;
        });
        chai_1.expect(result).to.equal('error');
        chai_1.expect(onFallback).calledWith({
            reason: { error },
            handled: true,
            duration: (_a = onFallback.args[0]) === null || _a === void 0 ? void 0 : _a[0].duration,
        });
    });
    it('links parent cancellation token', async () => {
        const parent = new CancellationToken_1.CancellationTokenSource();
        await Policy_1.Policy.handleAll()
            .fallback('error')
            .execute(({ cancellationToken }) => {
            chai_1.expect(cancellationToken.isCancellationRequested).to.be.false;
            parent.cancel();
            chai_1.expect(cancellationToken.isCancellationRequested).to.be.true;
        }, parent.token);
    });
});
//# sourceMappingURL=FallbackPolicy.test.js.map
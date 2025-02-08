"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon_1 = require("sinon");
const CancellationToken_1 = require("./CancellationToken");
describe('CancellationToken', () => {
    it('emits a cancellation event', () => {
        const cts = new CancellationToken_1.CancellationTokenSource();
        const didCancel = sinon_1.stub();
        cts.token.onCancellationRequested(didCancel);
        chai_1.expect(didCancel).to.not.have.been.called;
        cts.cancel();
        chai_1.expect(didCancel).to.have.been.called;
    });
    it('marks the cancellation boolean', () => {
        const cts = new CancellationToken_1.CancellationTokenSource();
        chai_1.expect(cts.token.isCancellationRequested).to.be.false;
        cts.cancel();
        chai_1.expect(cts.token.isCancellationRequested).to.be.true;
    });
    it('resolves the cancellation promise', async () => {
        const cts = new CancellationToken_1.CancellationTokenSource();
        const prom = cts.token.cancellation();
        cts.cancel();
        await prom;
    });
    it('propagates cancellation down', async () => {
        const parent = new CancellationToken_1.CancellationTokenSource();
        const child = new CancellationToken_1.CancellationTokenSource(parent.token);
        chai_1.expect(child.token.isCancellationRequested).to.be.false;
        parent.cancel();
        chai_1.expect(parent.token.isCancellationRequested).to.be.true;
        chai_1.expect(child.token.isCancellationRequested).to.be.true;
    });
    it('does not propagate cancellation up', async () => {
        const parent = new CancellationToken_1.CancellationTokenSource();
        const child = new CancellationToken_1.CancellationTokenSource(parent.token);
        child.cancel();
        chai_1.expect(parent.token.isCancellationRequested).to.be.false;
        chai_1.expect(child.token.isCancellationRequested).to.be.true;
        parent.cancel();
        chai_1.expect(parent.token.isCancellationRequested).to.be.true;
    });
});
//# sourceMappingURL=CancellationToken.test.js.map
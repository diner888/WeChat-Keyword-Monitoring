"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon_1 = require("sinon");
const Executor_1 = require("./Executor");
class HandledError extends Error {
}
describe('executor', () => {
    let executor;
    let onSuccess;
    let onFailure;
    beforeEach(() => {
        executor = new Executor_1.ExecuteWrapper(error => error instanceof HandledError, r => typeof r === 'number' && r % 2 === 0);
        onSuccess = sinon_1.stub();
        onFailure = sinon_1.stub();
        executor.onFailure(onFailure);
        executor.onSuccess(onSuccess);
    });
    it('handles successful calls', async () => {
        const r = await executor.invoke(x => x * 3, 5);
        chai_1.expect(r).to.deep.equal({ success: 15 });
        chai_1.expect(onSuccess).to.been.calledOnce;
        chai_1.expect(onSuccess.args[0][0].duration).to.be.greaterThan(0);
    });
    it('deals with handled errors', async () => {
        const error = new HandledError();
        const r = await executor.invoke(() => {
            throw error;
        });
        chai_1.expect(r).to.deep.equal({ error });
        chai_1.expect(onFailure).to.been.calledOnce;
        chai_1.expect(onFailure.args[0][0].duration).to.be.greaterThan(0);
        chai_1.expect(onFailure.args[0][0].handled).to.be.true;
        chai_1.expect(onFailure.args[0][0].reason).to.deep.equal({ error });
    });
    it('deals with unhandled errors', async () => {
        const error = new Error();
        await chai_1.expect(executor.invoke(() => {
            throw error;
        })).to.eventually.be.rejectedWith(error);
        chai_1.expect(onFailure).to.been.calledOnce;
        chai_1.expect(onFailure.args[0][0].duration).to.be.greaterThan(0);
        chai_1.expect(onFailure.args[0][0].handled).to.be.false;
        chai_1.expect(onFailure.args[0][0].reason).to.deep.equal({ error });
    });
});
//# sourceMappingURL=Executor.test.js.map
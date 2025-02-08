"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon_1 = require("sinon");
const util_1 = require("util");
const CancellationToken_1 = require("./CancellationToken");
const util_test_1 = require("./common/util.test");
const TaskCancelledError_1 = require("./errors/TaskCancelledError");
const Policy_1 = require("./Policy");
const TimeoutPolicy_1 = require("./TimeoutPolicy");
const delay = util_1.promisify(setTimeout);
describe('TimeoutPolicy', () => {
    it('works when no timeout happens', async () => {
        const policy = Policy_1.Policy.timeout(1000, TimeoutPolicy_1.TimeoutStrategy.Cooperative);
        chai_1.expect(await policy.execute(() => 42)).to.equal(42);
    });
    it('properly cooperatively cancels', async () => {
        const policy = Policy_1.Policy.timeout(2, TimeoutPolicy_1.TimeoutStrategy.Cooperative);
        chai_1.expect(await policy.execute(async ({ cancellation }) => {
            chai_1.expect(cancellation.isCancellationRequested).to.be.false;
            await delay(3);
            chai_1.expect(cancellation.isCancellationRequested).to.be.true;
            return 42;
        })).to.equal(42);
    });
    it('properly aggressively cancels', async () => {
        const policy = Policy_1.Policy.timeout(5, TimeoutPolicy_1.TimeoutStrategy.Aggressive);
        let verified;
        await chai_1.expect(policy.execute(async ({ cancellation }) => (verified = (async () => {
            await delay(0);
            chai_1.expect(cancellation.isCancellationRequested).to.be.false;
            await delay(5);
            chai_1.expect(cancellation.isCancellationRequested).to.be.true;
        })()))).to.eventually.be.rejectedWith(TaskCancelledError_1.TaskCancelledError);
        await verified;
    });
    it('does not unref by default', async () => {
        // this would timeout if the timers were referenced
        const output = await util_test_1.runInChild(`
      Policy.timeout(100, 'aggressive')
        .execute(() => new Promise(() => {}));
    `);
        chai_1.expect(output).to.contain('Operation timed out');
    });
    it('unrefs as requested', async () => {
        // this would timeout if the timers were referenced
        const output = await util_test_1.runInChild(`
      Policy.timeout(60 * 1000, 'aggressive')
        .dangerouslyUnref()
        .execute(() => new Promise(() => {}));
    `);
        chai_1.expect(output).to.be.empty;
    });
    it('links parent cancellation token', async () => {
        const parent = new CancellationToken_1.CancellationTokenSource();
        await Policy_1.Policy.timeout(1000, TimeoutPolicy_1.TimeoutStrategy.Cooperative).execute((_, ct) => {
            chai_1.expect(ct.isCancellationRequested).to.be.false;
            parent.cancel();
            chai_1.expect(ct.isCancellationRequested).to.be.true;
        }, parent.token);
    });
    it('still has own timeout if given parent', async () => {
        const parent = new CancellationToken_1.CancellationTokenSource();
        await Policy_1.Policy.timeout(1, TimeoutPolicy_1.TimeoutStrategy.Cooperative).execute(async (_, ct) => {
            chai_1.expect(ct.isCancellationRequested).to.be.false;
            await delay(3);
            chai_1.expect(ct.isCancellationRequested).to.be.true;
        }, parent.token);
    });
    describe('events', () => {
        let onSuccess;
        let onFailure;
        let onTimeout;
        let agg;
        let coop;
        beforeEach(() => {
            onSuccess = sinon_1.stub();
            onFailure = sinon_1.stub();
            onTimeout = sinon_1.stub();
            coop = Policy_1.Policy.timeout(2, TimeoutPolicy_1.TimeoutStrategy.Cooperative);
            agg = Policy_1.Policy.timeout(2, TimeoutPolicy_1.TimeoutStrategy.Aggressive);
            for (const p of [coop, agg]) {
                p.onFailure(onFailure);
                p.onSuccess(onSuccess);
                p.onTimeout(onTimeout);
            }
        });
        it('emits a success event (cooperative)', async () => {
            await coop.execute(() => 42);
            await delay(3);
            chai_1.expect(onSuccess).to.have.been.called;
            chai_1.expect(onFailure).to.not.have.been.called;
            chai_1.expect(onTimeout).to.not.have.been.called;
        });
        it('emits a success event (aggressive)', async () => {
            await agg.execute(() => 42);
            await delay(3);
            chai_1.expect(onSuccess).to.have.been.called;
            chai_1.expect(onFailure).to.not.have.been.called;
            chai_1.expect(onTimeout).to.not.have.been.called;
        });
        it('emits a timeout event (cooperative)', async () => {
            coop.onTimeout(onTimeout);
            await coop.execute(() => delay(3));
            chai_1.expect(onSuccess).to.have.been.called; // still returned a good value
            chai_1.expect(onTimeout).to.have.been.called;
            chai_1.expect(onFailure).to.not.have.been.called;
        });
        it('emits a timeout event (aggressive)', async () => {
            await chai_1.expect(agg.execute(() => delay(3))).to.be.rejectedWith(TaskCancelledError_1.TaskCancelledError);
            chai_1.expect(onSuccess).to.not.have.been.called;
            chai_1.expect(onTimeout).to.have.been.called;
            chai_1.expect(onFailure).to.have.been.called;
        });
        it('emits a failure event (cooperative)', async () => {
            await chai_1.expect(coop.execute(() => {
                throw new Error('oh no!');
            })).to.be.rejected;
            await delay(3);
            chai_1.expect(onSuccess).to.not.have.been.called;
            chai_1.expect(onTimeout).to.not.have.been.called;
            chai_1.expect(onFailure).to.have.been.called;
        });
        it('emits a failure event (aggressive)', async () => {
            await chai_1.expect(agg.execute(() => {
                throw new Error('oh no!');
            })).to.be.rejected;
            await delay(3);
            chai_1.expect(onSuccess).to.not.have.been.called;
            chai_1.expect(onTimeout).to.not.have.been.called;
            chai_1.expect(onFailure).to.have.been.called;
        });
    });
});
//# sourceMappingURL=TimeoutPolicy.test.js.map
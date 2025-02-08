"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const util_1 = require("util");
const CancellationToken_1 = require("./CancellationToken");
const defer_1 = require("./common/defer");
const BulkheadRejectedError_1 = require("./errors/BulkheadRejectedError");
const Errors_1 = require("./errors/Errors");
const Policy_1 = require("./Policy");
const delay = util_1.promisify(setTimeout);
describe('Bulkhead', () => {
    let order = [];
    let fnIndex = 0;
    beforeEach(() => {
        order = [];
        fnIndex = 0;
    });
    const makeFn = () => {
        const index = fnIndex++;
        return async () => {
            order.push(`${index}: enter`);
            await delay(index * 2);
            order.push(`${index}: exit`);
            return index;
        };
    };
    const makeFns = (count) => {
        const out = [];
        for (let i = 0; i < count; i++) {
            out.push(makeFn());
        }
        return out;
    };
    it('rejects calls after limit is hit', async () => {
        const b = Policy_1.Policy.bulkhead(2);
        const funcs = makeFns(3);
        const output = funcs.map(fn => b.execute(fn));
        await Promise.all([
            chai_1.expect(output[0]).to.eventually.equal(0),
            chai_1.expect(output[1]).to.eventually.equal(1),
            chai_1.expect(output[2]).to.be.rejectedWith(BulkheadRejectedError_1.BulkheadRejectedError),
        ]);
        chai_1.expect(order).to.deep.equal(['0: enter', '1: enter', '0: exit', '1: exit']);
    });
    it('queues requests, and rejects after queue limit', async () => {
        const b = Policy_1.Policy.bulkhead(2, 2);
        const funcs = makeFns(5);
        const output = funcs.map(fn => b.execute(fn));
        await Promise.all([
            chai_1.expect(output[0]).to.eventually.equal(0),
            chai_1.expect(output[1]).to.eventually.equal(1),
            chai_1.expect(output[2]).to.eventually.equal(2),
            chai_1.expect(output[3]).to.eventually.equal(3),
            chai_1.expect(output[4]).to.be.rejectedWith(BulkheadRejectedError_1.BulkheadRejectedError),
        ]);
        chai_1.expect(order).to.deep.equal([
            '0: enter',
            '1: enter',
            '0: exit',
            '2: enter',
            '1: exit',
            '3: enter',
            '2: exit',
            '3: exit',
        ]);
    });
    it('maintains proper state', async () => {
        const b = Policy_1.Policy.bulkhead(2, 2);
        const defer1 = defer_1.defer();
        const defer2 = defer_1.defer();
        const defer3 = defer_1.defer();
        const defer4 = defer_1.defer();
        chai_1.expect(b.queueSlots).to.equal(2);
        chai_1.expect(b.executionSlots).to.equal(2);
        const out1 = b.execute(() => defer1.promise);
        chai_1.expect(b.queueSlots).to.equal(2);
        chai_1.expect(b.executionSlots).to.equal(1);
        const out2 = b.execute(() => defer2.promise);
        chai_1.expect(b.queueSlots).to.equal(2);
        chai_1.expect(b.executionSlots).to.equal(0);
        const out3 = b.execute(() => defer3.promise);
        chai_1.expect(b.queueSlots).to.equal(1);
        chai_1.expect(b.executionSlots).to.equal(0);
        const out4 = b.execute(() => defer4.promise);
        chai_1.expect(b.queueSlots).to.equal(0);
        chai_1.expect(b.executionSlots).to.equal(0);
        defer1.resolve(undefined);
        await out1;
        chai_1.expect(b.executionSlots).to.equal(0);
        chai_1.expect(b.queueSlots).to.equal(1);
        defer2.resolve(undefined);
        await out2;
        chai_1.expect(b.executionSlots).to.equal(0);
        chai_1.expect(b.queueSlots).to.equal(2);
        defer3.resolve(undefined);
        await out3;
        chai_1.expect(b.executionSlots).to.equal(1);
        chai_1.expect(b.queueSlots).to.equal(2);
        defer4.resolve(undefined);
        await out4;
        chai_1.expect(b.executionSlots).to.equal(2);
        chai_1.expect(b.queueSlots).to.equal(2);
    });
    it('links parent cancellation token', async () => {
        const bulkhead = Policy_1.Policy.bulkhead(1, Infinity);
        const todo = [];
        for (let i = 0; i < 3; i++) {
            const parent = new CancellationToken_1.CancellationTokenSource();
            todo.push(bulkhead.execute(async ({ cancellationToken }) => {
                await delay(1);
                chai_1.expect(cancellationToken.isCancellationRequested).to.be.false;
                parent.cancel();
                chai_1.expect(cancellationToken.isCancellationRequested).to.be.true;
            }, parent.token));
        }
        // initially cancelled
        todo.push(chai_1.expect(bulkhead.execute(() => {
            throw new Error('expected not to call');
        }, CancellationToken_1.CancellationToken.Cancelled)).to.be.rejectedWith(Errors_1.TaskCancelledError));
        // cancelled by the time it gets executed
        const cancelledCts = new CancellationToken_1.CancellationTokenSource();
        setTimeout(() => cancelledCts.cancel(), 2);
        todo.push(chai_1.expect(bulkhead.execute(() => {
            throw new Error('expected not to call');
        }, cancelledCts.token)).to.be.rejectedWith(Errors_1.TaskCancelledError));
        await Promise.all(todo);
    });
});
//# sourceMappingURL=BulkheadPolicy.test.js.map
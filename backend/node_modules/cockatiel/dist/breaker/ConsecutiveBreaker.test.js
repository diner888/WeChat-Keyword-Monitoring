"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const ConsecutiveBreaker_1 = require("./ConsecutiveBreaker");
describe('ConsecutiveBreaker', () => {
    it('works', () => {
        const c = new ConsecutiveBreaker_1.ConsecutiveBreaker(3);
        chai_1.expect(c.failure()).to.be.false;
        chai_1.expect(c.failure()).to.be.false;
        chai_1.expect(c.failure()).to.be.true;
        chai_1.expect(c.failure()).to.be.true;
        c.success();
        chai_1.expect(c.failure()).to.be.false;
        chai_1.expect(c.failure()).to.be.false;
        chai_1.expect(c.failure()).to.be.true;
    });
});
//# sourceMappingURL=ConsecutiveBreaker.test.js.map
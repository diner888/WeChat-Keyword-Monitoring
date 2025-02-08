"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const ExponentialBackoffGenerators_1 = require("./ExponentialBackoffGenerators");
describe('ExponentialBackoff Generators', () => {
    const generators = [
        { name: 'noJitterGenerator', generator: ExponentialBackoffGenerators_1.noJitterGenerator },
        { name: 'fullJitterGenerator', generator: ExponentialBackoffGenerators_1.fullJitterGenerator },
        { name: 'halfJitterGenerator', generator: ExponentialBackoffGenerators_1.halfJitterGenerator },
        { name: 'decorrelatedJitterGenerator', generator: ExponentialBackoffGenerators_1.decorrelatedJitterGenerator },
    ];
    for (const { name, generator } of generators) {
        it(`${name} is sane`, () => {
            const options = {
                generator,
                maxDelay: 30000,
                maxAttempts: Infinity,
                exponent: 2,
                initialDelay: 128,
            };
            for (let i = 0; i < 10; i++) {
                let state;
                for (let k = 1; k < 100; k++) {
                    const [delay, nextState] = generator(state, options);
                    chai_1.expect(delay).to.be.gte(0);
                    chai_1.expect(delay).to.be.lte(Math.min(30000, options.initialDelay * 2 ** k));
                    state = nextState;
                }
            }
        });
    }
});
//# sourceMappingURL=ExponentialBackoffGenerators.test.js.map
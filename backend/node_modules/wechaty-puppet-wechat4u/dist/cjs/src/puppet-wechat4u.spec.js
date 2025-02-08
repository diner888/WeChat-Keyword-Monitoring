#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tstest_1 = require("tstest");
const puppet_wechat4u_js_1 = require("./puppet-wechat4u.js");
class PuppetWechat4uTest extends puppet_wechat4u_js_1.PuppetWechat4u {
}
/**
 * Huan(202110): skip this test for now
 */
tstest_1.test.skip('PuppetWechat4u restart without problem', async (t) => {
    const puppet = new PuppetWechat4uTest();
    try {
        for (let i = 0; i < 3; i++) {
            await puppet.start();
            await puppet.stop();
            t.pass('start/stop-ed at #' + i);
        }
        t.pass('PuppetWechat4u() start/restart successed.');
    }
    catch (e) {
        t.fail(e);
    }
});
//# sourceMappingURL=puppet-wechat4u.spec.js.map
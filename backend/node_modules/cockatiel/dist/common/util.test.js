"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const path = require("path");
/**
 * Runs the code in a child process, and returns its stdout/err string.
 */
async function runInChild(code) {
    var _a, _b;
    const cwd = path.resolve(__dirname, '..', '..');
    const file = path.resolve(cwd, '.test.js');
    after(done => fs_1.unlink(file, () => done()));
    fs_1.writeFileSync(file, `const { Policy } = require('./');\n${code}`);
    const child = child_process_1.fork(file, [], { cwd, stdio: 'pipe' });
    const output = [];
    (_a = child.stderr) === null || _a === void 0 ? void 0 : _a.on('data', d => output.push(d));
    (_b = child.stdout) === null || _b === void 0 ? void 0 : _b.on('data', d => output.push(d));
    await new Promise((resolve, reject) => {
        child.on('error', reject);
        child.on('exit', resolve);
    });
    return Buffer.concat(output).toString().replace(/\r?\n/g, '\n').trim();
}
exports.runInChild = runInChild;
//# sourceMappingURL=util.test.js.map
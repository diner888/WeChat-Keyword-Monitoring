import { fork } from 'child_process';
import { unlink, writeFileSync } from 'fs';
import * as path from 'path';
/**
 * Runs the code in a child process, and returns its stdout/err string.
 */
export async function runInChild(code) {
    var _a, _b;
    const cwd = path.resolve(__dirname, '..', '..');
    const file = path.resolve(cwd, '.test.js');
    after(done => unlink(file, () => done()));
    writeFileSync(file, `const { Policy } = require('./');\n${code}`);
    const child = fork(file, [], { cwd, stdio: 'pipe' });
    const output = [];
    (_a = child.stderr) === null || _a === void 0 ? void 0 : _a.on('data', d => output.push(d));
    (_b = child.stdout) === null || _b === void 0 ? void 0 : _b.on('data', d => output.push(d));
    await new Promise((resolve, reject) => {
        child.on('error', reject);
        child.on('exit', resolve);
    });
    return Buffer.concat(output).toString().replace(/\r?\n/g, '\n').trim();
}
//# sourceMappingURL=util.test.js.map
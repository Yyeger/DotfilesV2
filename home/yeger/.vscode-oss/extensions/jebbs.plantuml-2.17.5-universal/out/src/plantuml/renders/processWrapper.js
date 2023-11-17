"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processWrapper = void 0;
const fs = require("fs");
function processWrapper(process, pipeFilePath) {
    return new Promise((resolve, reject) => {
        let buffOut = [];
        let buffOutLen = 0;
        let buffErr = [];
        let buffErrLen = 0;
        // let pipeFile = pipeFilePath ? fs.createWriteStream(pipeFilePath) : null;
        // if (pipeFile) process.stdout.pipe(pipeFile);
        process.stdout.on('data', function (chunck) {
            buffOut.push(chunck);
            buffOutLen += chunck.length;
        });
        process.stderr.on('data', function (chunck) {
            buffErr.push(chunck);
            buffErrLen += chunck.length;
        });
        process.stdout.on('close', () => {
            let stdout = Buffer.concat(buffOut, buffOutLen);
            if (pipeFilePath && stdout.length) {
                fs.writeFileSync(pipeFilePath, stdout);
                stdout = Buffer.from(pipeFilePath);
            }
            let stderr = Buffer.concat(buffErr, buffErrLen).toString();
            // If environment variables such as JAVA_TOOL_OPTIONS or _JAVA_OPTIONS are set,
            // some java implementations will echo them on stderr.
            stderr = stderr.replace(/^Picked up .*$/mg, "").trim();
            if (stderr) {
                reject({ error: stderr, out: stdout });
                return;
            }
            resolve(stdout);
        });
    });
}
exports.processWrapper = processWrapper;
//# sourceMappingURL=processWrapper.js.map
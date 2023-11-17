"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileToBase64 = exports.javaCommandExists = exports.testJava = exports.addFileIndex = exports.calculateExportPath = exports.StopWatch = exports.showMessagePanel = exports.parseError = exports.isSubPath = exports.mkdirsSync = exports.mkdirs = void 0;
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const child_process = require("child_process");
const config_1 = require("./config");
const common_1 = require("./common");
const httpErrors_1 = require("./renders/httpErrors");
function mkdirs(dirname, callback) {
    fs.exists(dirname, function (exists) {
        if (exists) {
            callback();
        }
        else {
            mkdirs(path.dirname(dirname), function () {
                fs.mkdir(dirname, callback);
            });
        }
    });
}
exports.mkdirs = mkdirs;
function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    }
    else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}
exports.mkdirsSync = mkdirsSync;
function isSubPath(from, to) {
    let rel = path.relative(to, from);
    return !(path.isAbsolute(rel) || rel.substr(0, 2) == "..");
}
exports.isSubPath = isSubPath;
function parseError(error) {
    let nb = Buffer.alloc(0);
    if (typeof (error) === "string") {
        return [{ error: error, out: nb }];
    }
    else if (error instanceof TypeError || error instanceof Error) {
        let err = error;
        return [{ error: err.stack, out: nb }];
    }
    else if (error instanceof httpErrors_1.HTTPError) {
        let err = error.originalError;
        return [{ error: err.stack, out: nb }];
    }
    else if (error instanceof Array) {
        let arr = error;
        if (!arr || !arr.length)
            return [];
        if (instanceOfExportError(arr[0]))
            return error;
    }
    else {
        return [error];
    }
    return null;
    function instanceOfExportError(object) {
        return 'error' in object;
    }
}
exports.parseError = parseError;
function showMessagePanel(message) {
    common_1.outputPanel.clear();
    let errs;
    if (typeof (message) === "string") {
        common_1.outputPanel.appendLine(message);
    }
    else if (errs = parseError(message)) {
        for (let e of errs) {
            common_1.outputPanel.appendLine(e.error);
        }
    }
    else {
        common_1.outputPanel.appendLine(new Object(message).toString());
    }
    common_1.outputPanel.show();
}
exports.showMessagePanel = showMessagePanel;
class StopWatch {
    start() {
        this.startTime = new Date();
    }
    stop() {
        this.endTime = new Date();
        return this.runTime();
    }
    runTime() {
        return this.endTime.getTime() - this.startTime.getTime();
    }
}
exports.StopWatch = StopWatch;
function calculateExportPath(diagram, format) {
    // return "" if not saved.
    if (!path.isAbsolute(diagram.dir))
        return "";
    let exportDir = "";
    let folder = vscode.workspace.getWorkspaceFolder(diagram.parentUri);
    if (!config_1.config.exportIncludeFolderHeirarchy(diagram.parentUri)) {
        exportDir = config_1.config.exportOutDir(diagram.parentUri).fsPath;
    }
    else if (folder) {
        let wkdir = folder ? folder.uri.fsPath : "";
        let diagramsRoot = config_1.config.diagramsRoot(diagram.parentUri).fsPath;
        let outDir = config_1.config.exportOutDir(diagram.parentUri).fsPath;
        if (diagramsRoot && isSubPath(diagram.path, diagramsRoot)) {
            // If current document is in diagramsRoot, organize exports in exportOutDir.
            exportDir = path.join(outDir, path.relative(diagramsRoot, diagram.dir));
        }
        else if (wkdir && isSubPath(diagram.path, wkdir)) {
            // If current document is in WorkspaceFolder, organize exports in %outDir%/_WorkspaceFolder_.
            exportDir = path.join(outDir, "__WorkspaceFolder__", path.relative(wkdir, diagram.dir));
        }
    }
    else {
        // export beside the document.
        exportDir = diagram.dir;
    }
    if (config_1.config.exportSubFolder(diagram.parentUri)) {
        exportDir = path.join(exportDir, diagram.fileName);
    }
    return path.join(exportDir, diagram.name + "." + format);
}
exports.calculateExportPath = calculateExportPath;
function addFileIndex(fileName, index, count) {
    if (count == 1)
        return fileName;
    let bsName = path.basename(fileName);
    let ext = path.extname(fileName);
    return path.join(path.dirname(fileName), bsName.substr(0, bsName.length - ext.length) + "-page" + (index + 1) + ext);
}
exports.addFileIndex = addFileIndex;
function testJava(java) {
    try {
        let rt = child_process.spawnSync(java, ["-version"]);
        return rt.status == 0;
    }
    catch (error) {
        return false;
    }
}
exports.testJava = testJava;
let _javaExists = undefined;
function javaCommandExists() {
    if (_javaExists)
        return _javaExists;
    if (process.platform == 'darwin') {
        _javaExists = isMacJavaInstalled();
    }
    else {
        let cmd = "which";
        if (process.platform == 'win32')
            cmd = "where";
        try {
            let rt = child_process.spawnSync(cmd, ["java"]);
            _javaExists = rt.stdout.toString().trim() !== "";
        }
        catch (error) {
            _javaExists = false;
        }
    }
    return _javaExists;
}
exports.javaCommandExists = javaCommandExists;
function isMacJavaInstalled() {
    try {
        let rt = child_process.spawnSync("/usr/libexec/java_home");
        return rt.status == 0;
    }
    catch (error) {
        return false;
    }
}
function fileToBase64(file) {
    let mimeType = "";
    switch (path.extname(file)) {
        case '.svg':
            mimeType = 'image/svg+xml';
            break;
        case '.png':
            mimeType = 'image/png';
            break;
        default:
            break;
    }
    if (!mimeType)
        throw new Error("fileToBase64: Unsupported file type.");
    let b64 = fs.readFileSync(file).toString('base64');
    return `data:${mimeType};base64,${b64}`;
}
exports.fileToBase64 = fileToBase64;
//# sourceMappingURL=tools.js.map
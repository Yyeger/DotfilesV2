"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.RenderType = void 0;
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const common_1 = require("./common");
const configReader_1 = require("./configReader");
const tools_1 = require("./tools");
exports.RenderType = {
    Local: 'Local',
    PlantUMLServer: 'PlantUMLServer'
};
class Config extends configReader_1.ConfigReader {
    constructor() {
        super('plantuml');
        this._jar = {};
        this._java = {};
    }
    onChange(e) {
        this._jar = {};
        this._java = {};
    }
    jar(uri) {
        let folder = uri ? vscode.workspace.getWorkspaceFolder(uri) : undefined;
        let folderPath = folder ? folder.uri.fsPath : "";
        return this._jar[folderPath] || (() => {
            let jar = this.read('jar', uri, (folderUri, value) => {
                if (!value)
                    return "";
                if (!path.isAbsolute(value))
                    value = path.join(folderUri.fsPath, value);
                return value;
            });
            let intJar = path.join(common_1.extensionPath, "plantuml.jar");
            if (!jar) {
                jar = intJar;
            }
            else {
                if (!fs.existsSync(jar)) {
                    vscode.window.showWarningMessage((0, common_1.localize)(19, null));
                    jar = intJar;
                }
            }
            this._jar[folderPath] = jar;
            return jar;
        })();
    }
    fileExtensions(uri) {
        let extReaded = this.read('fileExtensions', uri).replace(/\s/g, "");
        let exts = extReaded || ".*";
        if (exts.indexOf(",") > 0)
            exts = `{${exts}}`;
        //REG: .* | .wsd | {.wsd,.java}
        if (!exts.match(/^(.\*|\.\w+|\{\.\w+(,\.\w+)*\})$/)) {
            throw new Error((0, common_1.localize)(18, null, extReaded));
        }
        return exts;
    }
    diagramsRoot(uri) {
        let folder = uri ? vscode.workspace.getWorkspaceFolder(uri) : undefined;
        if (!folder)
            return undefined;
        let fsPath = path.join(folder.uri.fsPath, this.read("diagramsRoot", uri));
        return vscode.Uri.file(fsPath);
    }
    exportOutDir(uri) {
        let folder = uri ? vscode.workspace.getWorkspaceFolder(uri) : undefined;
        if (!folder)
            return undefined;
        let fsPath = path.join(folder.uri.fsPath, this.read("exportOutDir", uri) || "out");
        return vscode.Uri.file(fsPath);
    }
    exportFormat(uri) {
        return this.read('exportFormat', uri);
    }
    exportSubFolder(uri) {
        return this.read('exportSubFolder', uri);
    }
    exportIncludeFolderHeirarchy(uri) {
        return this.read('exportIncludeFolderHeirarchy', uri);
    }
    exportConcurrency(uri) {
        return this.read('exportConcurrency') || 3;
    }
    exportMapFile(uri) {
        return this.read('exportMapFile', uri) || false;
    }
    get previewAutoUpdate() {
        return this.read('previewAutoUpdate');
    }
    get previewSnapIndicators() {
        return this.read('previewSnapIndicators');
    }
    server(uri) {
        return this.read('server').trim().replace(/\/+$/g, "");
    }
    get urlFormat() {
        return this.read('urlFormat');
    }
    get urlResult() {
        return this.read('urlResult') || "MarkDown";
    }
    render(uri) {
        return this.read('render') || "Local";
    }
    includepaths(uri) {
        return this.read('includepaths', uri);
    }
    lintDiagramNoName(uri) {
        return this.read('lintDiagramNoName', uri);
    }
    commandArgs(uri) {
        return this.read('commandArgs', uri) || [];
    }
    jarArgs(uri) {
        return this.read('jarArgs', uri) || [];
    }
    java(uri) {
        let folder = uri ? vscode.workspace.getWorkspaceFolder(uri) : undefined;
        let folderPath = folder ? folder.uri.fsPath : "";
        return this._java[folderPath] || (() => {
            let java = this.read('java') || "java";
            if (java == "java") {
                if ((0, tools_1.javaCommandExists)())
                    this._java[folderPath] = java;
            }
            else {
                if ((0, tools_1.testJava)(java)) {
                    this._java[folderPath] = java;
                }
                else {
                    vscode.window.showWarningMessage((0, common_1.localize)(54, null, java));
                }
            }
            return java;
        })();
    }
}
exports.config = new Config();
//# sourceMappingURL=config.js.map
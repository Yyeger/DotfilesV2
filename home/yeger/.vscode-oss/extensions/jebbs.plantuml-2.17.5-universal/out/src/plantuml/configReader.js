"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigReader = void 0;
const vscode = require("vscode");
class ConfigReader extends vscode.Disposable {
    constructor(section) {
        super(() => this.dispose());
        this._disposables = [];
        this._section = section;
        this._disposables.push(vscode.workspace.onDidChangeConfiguration(e => this.onChange(e)), vscode.workspace.onDidGrantWorkspaceTrust(e => this.onChange(e)));
    }
    dispose() {
        this._disposables.length && this._disposables.forEach(d => d.dispose());
    }
    read(key, ...para) {
        let resource = para.shift();
        let folder = resource ? vscode.workspace.getWorkspaceFolder(resource) : undefined;
        let conf = vscode.workspace.getConfiguration(this._section, resource);
        let value = conf.get(key);
        let func = undefined;
        if (para.length)
            func = para.shift();
        if (func && folder && folder.uri) {
            value = func(folder.uri, value);
        }
        // console.log(key, "=", value, ":", resource ? resource.fsPath : "undefined");
        return value;
    }
}
exports.ConfigReader = ConfigReader;
//# sourceMappingURL=configReader.js.map
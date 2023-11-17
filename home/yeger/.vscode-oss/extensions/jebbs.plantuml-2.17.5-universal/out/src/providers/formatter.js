"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Formatter = void 0;
const vscode = require("vscode");
const tools_1 = require("../plantuml/tools");
const formatRules_1 = require("../plantuml/formatRules");
const fmt = require("../plantuml/formatter/formatter");
const common_1 = require("../plantuml/common");
class Formatter extends vscode.Disposable {
    constructor() {
        super(() => this.dispose());
        this._disposables = [];
        this._formatter = new fmt.Formatter(formatRules_1.formatRules, {
            allowInlineFormat: false,
            allowSplitLine: true,
            newLineForBlockStart: false
        });
        this._disposables.push(vscode.languages.registerDocumentFormattingEditProvider([
            { scheme: 'file', language: common_1.languageid },
            { scheme: 'untitled', language: common_1.languageid },
        ], this));
    }
    dispose() {
        this._disposables && this._disposables.length && this._disposables.map(d => d.dispose());
    }
    provideDocumentFormattingEdits(document, options, token) {
        try {
            if (vscode.workspace.getConfiguration("editor", document.uri).get("formatOnSave")) {
                console.log("PlantUML format disabled when 'editor.formatOnSave' is on, because it is not reliable enough.");
                return;
            }
            return this._formatter.formate(document, options, token);
        }
        catch (error) {
            (0, tools_1.showMessagePanel)((0, tools_1.parseError)(error));
        }
    }
}
exports.Formatter = Formatter;
//# sourceMappingURL=formatter.js.map
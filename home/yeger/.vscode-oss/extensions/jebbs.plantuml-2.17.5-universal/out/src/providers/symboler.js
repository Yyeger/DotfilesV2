"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Symbol = void 0;
const vscode = require("vscode");
const tools_1 = require("../plantuml/diagram/tools");
const common_1 = require("../plantuml/common");
class Symbol extends vscode.Disposable {
    constructor() {
        super(() => this.dispose());
        this._disposables = [];
        let sel = [
            { scheme: 'file', language: common_1.languageid },
            { scheme: 'file', language: 'markdown' },
            { scheme: 'file', language: 'c' },
            { scheme: 'file', language: 'csharp' },
            { scheme: 'file', language: 'cpp' },
            { scheme: 'file', language: 'clojure' },
            { scheme: 'file', language: 'coffeescript' },
            { scheme: 'file', language: 'fsharp' },
            { scheme: 'file', language: 'go' },
            { scheme: 'file', language: 'groovy' },
            { scheme: 'file', language: 'java' },
            { scheme: 'file', language: 'javascript' },
            { scheme: 'file', language: 'javascriptreact' },
            { scheme: 'file', language: 'lua' },
            { scheme: 'file', language: 'objective-c' },
            { scheme: 'file', language: 'objective-cpp' },
            { scheme: 'file', language: 'php' },
            { scheme: 'file', language: 'perl' },
            { scheme: 'file', language: 'perl6' },
            { scheme: 'file', language: 'python' },
            { scheme: 'file', language: 'ruby' },
            { scheme: 'file', language: 'rust' },
            { scheme: 'file', language: 'swift' },
            { scheme: 'file', language: 'typescript' },
            { scheme: 'file', language: 'typescriptreact' },
            { scheme: 'file', language: 'vb' },
            { scheme: 'file', language: 'plaintext' },
            { scheme: 'untitled', language: common_1.languageid },
            { scheme: 'untitled', language: 'markdown' },
            { scheme: 'untitled', language: 'c' },
            { scheme: 'untitled', language: 'csharp' },
            { scheme: 'untitled', language: 'cpp' },
            { scheme: 'untitled', language: 'clojure' },
            { scheme: 'untitled', language: 'coffeescript' },
            { scheme: 'untitled', language: 'fsharp' },
            { scheme: 'untitled', language: 'go' },
            { scheme: 'untitled', language: 'groovy' },
            { scheme: 'untitled', language: 'java' },
            { scheme: 'untitled', language: 'javascript' },
            { scheme: 'untitled', language: 'javascriptreact' },
            { scheme: 'untitled', language: 'lua' },
            { scheme: 'untitled', language: 'objective-c' },
            { scheme: 'untitled', language: 'objective-cpp' },
            { scheme: 'untitled', language: 'php' },
            { scheme: 'untitled', language: 'perl' },
            { scheme: 'untitled', language: 'perl6' },
            { scheme: 'untitled', language: 'python' },
            { scheme: 'untitled', language: 'ruby' },
            { scheme: 'untitled', language: 'rust' },
            { scheme: 'untitled', language: 'swift' },
            { scheme: 'untitled', language: 'typescript' },
            { scheme: 'untitled', language: 'typescriptreact' },
            { scheme: 'untitled', language: 'vb' },
            { scheme: 'untitled', language: 'plaintext' },
        ];
        this._disposables.push(vscode.languages.registerDocumentSymbolProvider(sel, this));
    }
    dispose() {
        this._disposables && this._disposables.length && this._disposables.map(d => d.dispose());
    }
    provideDocumentSymbols(document, token) {
        let results = [];
        let diagrams = (0, tools_1.diagramsOf)(document);
        for (let d of diagrams) {
            const location = new vscode.Location(document.uri, new vscode.Range(d.start, d.end));
            results.push(new vscode.SymbolInformation(d.name, vscode.SymbolKind.Object, "", location));
        }
        return results;
    }
}
exports.Symbol = Symbol;
//# sourceMappingURL=symboler.js.map
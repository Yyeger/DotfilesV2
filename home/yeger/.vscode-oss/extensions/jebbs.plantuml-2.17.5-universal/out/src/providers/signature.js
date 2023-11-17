"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signature = void 0;
const vscode = require("vscode");
const macros_1 = require("../plantuml/intellisense/macros");
const common_1 = require("../plantuml/common");
class Signature extends vscode.Disposable {
    constructor() {
        super(() => this.dispose());
        this._disposables = [];
        let sel = [
            { scheme: 'file', language: common_1.languageid },
            { scheme: 'untitled', language: common_1.languageid },
        ];
        this._disposables.push(vscode.languages.registerSignatureHelpProvider(sel, this, "(", ","));
    }
    dispose() {
        this._disposables && this._disposables.length && this._disposables.map(d => d.dispose());
    }
    provideSignatureHelp(document, position, token) {
        const line = document.lineAt(position.line);
        const macroCallInfo = (0, macros_1.macroCallOf)(line, position.character);
        if (!macroCallInfo) {
            return null;
        }
        const macros = (0, macros_1.macrosOf)(document, position);
        var macro = macros.firstOrDefault(m => m.name == macroCallInfo.macroName);
        if (!macro) {
            return null;
        }
        return this.createSignatureHelp(macroCallInfo, macro);
    }
    createSignatureHelp(macroCallInfo, macro) {
        const signatureHelp = new vscode.SignatureHelp();
        macro.getSignatures().forEach(s => {
            const signatureInfo = new vscode.SignatureInformation(macro.getSignatureLabel(s));
            signatureInfo.parameters = s.map(p => new vscode.ParameterInformation(p));
            signatureHelp.signatures.push(signatureInfo);
        });
        const matchedSignatureIndex = signatureHelp.signatures.findIndex(s => s.parameters.length == macroCallInfo.availableParameters);
        signatureHelp.activeSignature = matchedSignatureIndex >= 0 ? matchedSignatureIndex : 0;
        signatureHelp.activeParameter = macroCallInfo.activeParameter;
        return signatureHelp;
    }
}
exports.Signature = Signature;
//# sourceMappingURL=signature.js.map
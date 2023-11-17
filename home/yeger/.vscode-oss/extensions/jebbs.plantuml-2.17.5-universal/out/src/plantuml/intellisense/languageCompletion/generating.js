"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLanguageWords = void 0;
const config_1 = require("../../config");
const child_process = require("child_process");
const vscode = require("vscode");
const processWrapper_1 = require("../../renders/processWrapper");
const shared_1 = require("./shared");
function getLanguageWords() {
    let java = config_1.config.java(undefined);
    if (config_1.config.render(undefined) !== config_1.RenderType.Local || !java) {
        return Promise.resolve([]);
    }
    let params = [
        '-Djava.awt.headless=true',
        '-jar',
        config_1.config.jar(null),
        "-language",
    ];
    let ps = child_process.spawn(java, params);
    return (0, processWrapper_1.processWrapper)(ps).then(buf => processWords(buf.toString()), () => []);
}
exports.getLanguageWords = getLanguageWords;
function processWords(value) {
    let results = [];
    let words = value.split('\n').map(w => w.trim());
    let curKind = undefined;
    words.forEach(word => {
        if (!word)
            return;
        let label = word.replace(shared_1.REG_CLEAN_LABEL, "");
        if (!label)
            return;
        if (word.substr(0, 1) == ';') {
            switch (word) {
                case ";type":
                    curKind = vscode.CompletionItemKind.Struct;
                    return;
                case ";keyword":
                    curKind = vscode.CompletionItemKind.Keyword;
                    return;
                case ";preprocessor":
                    curKind = vscode.CompletionItemKind.Function;
                    return;
                case ";skinparameter":
                    curKind = vscode.CompletionItemKind.Field;
                    return;
                case ";color":
                    curKind = vscode.CompletionItemKind.Color;
                    return;
                default:
                    return;
            }
        }
        if (!curKind)
            return;
        results.push({ label: label, name: word, kind: curKind });
    });
    return results;
}
//# sourceMappingURL=generating.js.map
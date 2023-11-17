"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageCompletionItems = exports.dicLanguageWords = void 0;
const vscode = require("vscode");
const generating_1 = require("./generating");
const predefined_1 = require("./predefined");
exports.dicLanguageWords = new Set([]);
let cachedItems = undefined;
// pre-cache before user needs
LanguageCompletionItems();
function LanguageCompletionItems() {
    return __awaiter(this, void 0, void 0, function* () {
        if (cachedItems !== undefined) {
            return Promise.resolve(cachedItems);
        }
        // clear dicLanguageWords
        exports.dicLanguageWords = new Set([]);
        let words = yield (0, generating_1.getLanguageWords)();
        for (let word of (0, predefined_1.getPredefinedLanguageWords)()) {
            let dup = words.find(w => (w.name == word.name && w.kind == word.kind));
            if (dup)
                continue;
            words.push(word);
        }
        cachedItems = words.map(word => {
            exports.dicLanguageWords.add(word.name);
            let item = new vscode.CompletionItem(word.label, word.kind);
            item.insertText = new vscode.SnippetString(word.name);
            return item;
        });
        return cachedItems;
    });
}
exports.LanguageCompletionItems = LanguageCompletionItems;
//# sourceMappingURL=index.js.map
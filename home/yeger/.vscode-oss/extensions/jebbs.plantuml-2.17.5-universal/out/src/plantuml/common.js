"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.localize = exports.extensionPath = exports.bar = exports.outputPanel = exports.languageid = void 0;
const vscode = require("vscode");
const nls = require("vscode-nls");
const path_1 = require("path");
exports.languageid = "plantuml";
exports.outputPanel = vscode.window.createOutputChannel("PlantUML");
exports.bar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
exports.extensionPath = vscode.extensions.getExtension("jebbs.plantuml").extensionPath;
nls.config({ locale: vscode.env.language });
exports.localize = nls.loadMessageBundle((0, path_1.join)(exports.extensionPath, "langs", "lang.json"));
//# sourceMappingURL=common.js.map
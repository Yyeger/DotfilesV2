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
exports.verifyExecutable = exports.get_client = void 0;
const path = require("path");
const vscode_1 = require("vscode");
const child_process_1 = require("child_process");
const node_1 = require("vscode-languageclient/node");
let client;
function get_client(context) {
    return __awaiter(this, void 0, void 0, function* () {
        let clientOptions = {
            documentSelector: [{ scheme: 'file', language: 'erlang' }],
            synchronize: {
                fileEvents: [
                    vscode_1.workspace.createFileSystemWatcher('**/rebar.config'),
                    vscode_1.workspace.createFileSystemWatcher('**/rebar.lock')
                ]
            },
            middleware: {
                executeCommand: (command, args, next) => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b, _c;
                    //Ask for user input if the argument contains {user_input: {type: string, text? : string}}
                    //Used by Wrangler
                    if (command.split(':').length >= 2
                        && command.split(':')[1].startsWith("wrangler-")
                        && args.length >= 1
                        && "user_input" in args[0]
                        && "type" in args[0].user_input) {
                        var input;
                        switch (args[0].user_input.type) {
                            case "variable":
                                input = yield vscode_1.window.showInputBox({
                                    placeHolder: (_a = args[0].user_input.text) !== null && _a !== void 0 ? _a : "New name", validateInput: (value) => {
                                        if (!/^[A-Z][\_a-zA-Z0-9\@]*$/.test(value)) {
                                            return "Name must be a valid Erlang variable name";
                                        }
                                        return null;
                                    }
                                });
                                break;
                            case "atom":
                                input = yield vscode_1.window.showInputBox({
                                    placeHolder: (_b = args[0].user_input.text) !== null && _b !== void 0 ? _b : "New name", validateInput: (value) => {
                                        if (!(/^[a-z][\_a-zA-Z0-9\@]*$/.test(value) || /^[\'][\_a-zA-Z0-9\@]*[\']$/.test(value))) {
                                            return "Name must be a valid Erlang atom";
                                        }
                                        return null;
                                    }
                                });
                                break;
                            case "macro":
                                input = yield vscode_1.window.showInputBox({
                                    placeHolder: (_c = args[0].user_input.text) !== null && _c !== void 0 ? _c : "New name", validateInput: (value) => {
                                        if (!(/^[\_a-zA-Z0-9\@]+$/.test(value))) {
                                            return "Name must be a valid Erlang macro name";
                                        }
                                        return null;
                                    }
                                });
                                break;
                            case "file":
                                const uri = yield vscode_1.window.showOpenDialog({ canSelectFiles: true, canSelectFolders: false, canSelectMany: false });
                                if (uri !== undefined) {
                                    input = uri[0].fsPath;
                                }
                                break;
                            default:
                                vscode_1.window.showErrorMessage("Unknown user input type: " + args[0].user_input.type);
                                break;
                        }
                        args = args.slice(0);
                        if (input !== undefined) {
                            args[0].user_input.value = input;
                        }
                        else {
                            //abort execution
                            return;
                        }
                    }
                    ;
                    return next(command, args);
                })
            }
        };
        let serverPath = vscode_1.workspace.getConfiguration('erlang_ls').serverPath;
        if (serverPath === "") {
            serverPath = context.asAbsolutePath(path.join('erlang_ls', '_build', 'default', 'bin', 'erlang_ls'));
        }
        ;
        let logLevel = vscode_1.workspace.getConfiguration('erlang_ls').logLevel;
        let serverArgs = [serverPath, "--log-level", logLevel];
        let logPath = vscode_1.workspace.getConfiguration('erlang_ls').logPath;
        if (logPath !== "") {
            serverArgs.push("--log-dir", logPath);
        }
        let serverOptions = {
            command: 'escript',
            args: serverArgs,
            transport: node_1.TransportKind.stdio
        };
        verifyExecutable(serverPath);
        return new node_1.LanguageClient('erlang_ls', 'Erlang LS', serverOptions, clientOptions);
    });
}
exports.get_client = get_client;
function verifyExecutable(serverPath) {
    const res = (0, child_process_1.spawnSync)('escript', [serverPath, "--version"]);
    if (res.status !== 0) {
        vscode_1.window.showErrorMessage('Could not start Language Server. Error: ' + res.stdout);
    }
}
exports.verifyExecutable = verifyExecutable;
//# sourceMappingURL=client.js.map
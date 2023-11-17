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
exports.registerDebugAdapterDescriptorFactory = void 0;
const vscode = require("vscode");
const path = require("path");
const DEBUG_TYPE = 'erlang';
function registerDebugAdapterDescriptorFactory(context) {
    return vscode.debug.registerDebugAdapterDescriptorFactory(DEBUG_TYPE, new ErlangDebugAdapterExecutableFactory(context));
}
exports.registerDebugAdapterDescriptorFactory = registerDebugAdapterDescriptorFactory;
class ErlangDebugAdapterExecutableFactory {
    constructor(context) {
        this.context = context;
    }
    createDebugAdapterDescriptor(_session, _executable) {
        return __awaiter(this, void 0, void 0, function* () {
            const erlangConfig = vscode.workspace;
            const executable = erlangConfig.getConfiguration('erlang_ls').get('dapPath') || '';
            let command = 'escript';
            let args;
            if (executable.length > 0) {
                args = [executable.split(' ')[0]];
            }
            else {
                // use default
                args = [this.context.asAbsolutePath(path.join('erlang_ls', '_build', 'dap', 'bin', 'els_dap'))];
            }
            return new vscode.DebugAdapterExecutable(command, args, undefined);
        });
    }
}
//# sourceMappingURL=debugger.js.map
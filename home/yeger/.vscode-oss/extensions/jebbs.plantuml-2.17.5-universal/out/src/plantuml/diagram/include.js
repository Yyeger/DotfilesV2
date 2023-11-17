"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContentWithInclude = void 0;
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const config_1 = require("../config");
// http://plantuml.com/en/preprocessing
const INCLUDE_REG = /^\s*!(include(?:sub)?)\s+(.+?)(?:!(\w+))?$/i;
const STARTSUB_TEST_REG = /^\s*!startsub\s+(\w+)/i;
const ENDSUB_TEST_REG = /^\s*!endsub\b/i;
const START_DIAGRAM_REG = /(^|\r?\n)\s*@start.*\r?\n/i;
const END_DIAGRAM_REG = /\r?\n\s*@end.*(\r?\n|$)(?!.*\r?\n\s*@end.*(\r?\n|$))/i;
let _included = {};
let _route = [];
function getContentWithInclude(diagram) {
    _included = {};
    if (diagram.parentUri) {
        _route = [diagram.parentUri.fsPath];
    }
    else {
        _route = [];
    }
    // console.log('Start from:', _route[0]);
    let searchPaths = getSearchPaths(diagram.parentUri);
    return resolveInclude(diagram.lines, searchPaths);
}
exports.getContentWithInclude = getContentWithInclude;
function resolveInclude(content, searchPaths) {
    let lines = content instanceof Array ? content : content.replace(/\r\n|\r/g, "\n").split('\n');
    let processedLines = lines.map(line => line.replace(INCLUDE_REG, (match, ...args) => {
        let Action = args[0].toLowerCase();
        let target = args[1].trim();
        let sub = args[2];
        let file = path.isAbsolute(target) ? target : findFile(target, searchPaths);
        let result;
        if (Action == "include") {
            result = getIncludeContent(file);
        }
        else {
            result = getIncludesubContent(file, sub);
        }
        return result === undefined ? match : result;
    }));
    return processedLines.join('\n');
}
function getSearchPaths(uri) {
    let searchPaths = [];
    if (uri) {
        searchPaths.push(path.dirname(uri.fsPath));
    }
    searchPaths.push(...config_1.config.includepaths(uri));
    let diagramsRoot = config_1.config.diagramsRoot(uri);
    if (diagramsRoot)
        searchPaths.push(diagramsRoot.fsPath);
    return Array.from(new Set(searchPaths));
}
function findFile(file, searchPaths) {
    let found;
    for (let dir of searchPaths) {
        found = path.join(dir, file);
        if (fs.existsSync(found))
            return found;
    }
    return undefined;
}
function getIncludeContent(file) {
    if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile())
        return undefined;
    // console.log('Entering:', file);
    if (_included[file]) {
        // console.log("Ignore file already included:", file);
        return "";
    }
    _route.push(file);
    // TODO: read from editor for unsave changes
    let content = fs.readFileSync(file).toString();
    _included[file] = true;
    let result = resolveInclude(content, getSearchPaths(vscode.Uri.file(file)));
    _route.pop();
    // console.log('Leaving:', file);
    result = result.replace(START_DIAGRAM_REG, "$1");
    result = result.replace(END_DIAGRAM_REG, "$1");
    return result;
}
function getIncludesubContent(file, sub) {
    if (!file || !sub)
        return undefined;
    let identifier = `${file}!${sub}`;
    // // Disable sub block duplication check, to keep same behavior with PlantUML project
    // if (included[file]) {
    //     // console.log("ignore block already included:", file);
    //     return "";
    // }
    // console.log('Entering:', identifier);
    let find = findInArray(_route, identifier);
    if (find >= 0) {
        throw 'Include loop detected!' + '\n\n' + makeLoopInfo(find);
    }
    _route.push(identifier);
    let result = undefined;
    let blocks = getSubBlocks(file);
    if (blocks) {
        // included[identifier] = true;
        result = resolveInclude(blocks[sub], getSearchPaths(vscode.Uri.file(file)));
    }
    _route.pop();
    // console.log('Leaving:', identifier);
    return result;
}
function getSubBlocks(file) {
    if (!file)
        return {};
    let blocks = {};
    // TODO: read from editor for unsave changes
    let lines = fs.readFileSync(file).toString().split('\n');
    let subName = "";
    let match;
    for (let line of lines) {
        match = STARTSUB_TEST_REG.exec(line);
        if (match) {
            subName = match[1];
            continue;
        }
        else if (ENDSUB_TEST_REG.test(line)) {
            subName = "";
            continue;
        }
        else {
            if (subName) {
                if (!blocks[subName])
                    blocks[subName] = [];
                blocks[subName].push(line);
            }
        }
    }
    return blocks;
}
function findInArray(arr, find) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == find)
            return i;
    }
    return -1;
}
function makeLoopInfo(loopID) {
    let lines = [];
    for (let i = 0; i < loopID; i++) {
        lines.push(_route[i]);
    }
    lines.push('|-> ' + _route[loopID]);
    for (let i = loopID + 1; i < _route.length - 1; i++) {
        lines.push('|   ' + _route[loopID]);
    }
    lines.push('|<- ' + _route[_route.length - 1]);
    return lines.join('\n');
}
//# sourceMappingURL=include.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Diagram = exports.diagramEndReg = exports.diagramStartReg = void 0;
const path = require("path");
const title = require("./title");
const type_1 = require("./type");
const include_1 = require("./include");
exports.diagramStartReg = /@start(\w+)/i;
exports.diagramEndReg = /@end(\w+)/i;
class Diagram {
    constructor(content, ...para) {
        this._lines = undefined;
        this._type = undefined;
        this._nameRaw = undefined;
        this._name = undefined;
        this._index = undefined;
        this._pageCount = undefined;
        this._contentWithInclude = undefined;
        this.content = content;
        if (!para || para.length < 3)
            return;
        this.document = para[0];
        this.start = para[1];
        this.end = para[2];
        this.parentUri = this.document.uri;
        this.path = this.document.uri.fsPath;
        this.fileName = path.basename(this.path);
        let i = this.fileName.lastIndexOf(".");
        if (i >= 0)
            this.fileName = this.fileName.substr(0, i);
        this.dir = path.dirname(this.path);
        if (!path.isAbsolute(this.dir))
            this.dir = "";
    }
    get index() {
        if (this._index !== undefined) {
            return this._index;
        }
        this._index = 0;
        if (this.document && this.start) {
            for (let i = 0; i < this.start.line; i++) {
                if (exports.diagramStartReg.test(this.document.lineAt(i).text))
                    this._index++;
            }
        }
        return this._index;
    }
    get pageCount() {
        if (this._pageCount !== undefined) {
            return this._pageCount;
        }
        this._pageCount = 1;
        if (this.lines) {
            let regNewPage = /^\s*newpage\b/i;
            for (let text of this.lines) {
                if (regNewPage.test(text))
                    this._pageCount++;
            }
        }
        return this._pageCount;
    }
    get type() {
        return this._type || (this._type = (0, type_1.getType)(this));
    }
    get name() {
        if (this._name == undefined)
            this.getTitle();
        return this._name;
    }
    get nameRaw() {
        if (this._name == undefined)
            this.getTitle();
        return this._nameRaw;
    }
    get lines() {
        return this._lines || (this._lines = this.content.replace(/\r\n|\r/g, "\n").split('\n'));
    }
    get contentWithInclude() {
        return this._contentWithInclude || (this._contentWithInclude = (0, include_1.getContentWithInclude)(this));
    }
    isEqual(d) {
        if (this.parentUri.scheme !== d.parentUri.scheme)
            return false;
        if (this.dir !== d.dir)
            return false;
        if (this.fileName !== d.fileName)
            return false;
        if (!this.start || !d.start)
            return false;
        if (!this.start.isEqual(d.start))
            return false;
        return true;
    }
    getTitle() {
        let RegFName = /@start(\w+)\s+(.+?)\s*$/i;
        let matches;
        ;
        if (matches = this.lines[0].match(RegFName)) {
            this._nameRaw = matches[2];
            this._name = title.Deal(this._nameRaw);
            return;
        }
        // // don't use title as diagram name, #438, #400, #409
        // let inlineTitle = /^\s*title\s+(.+?)\s*$/i;
        // let multLineTitle = /^\s*title\s*$/i;
        // for (let text of this.lines) {
        //     if (inlineTitle.test(text)) {
        //         let matches = text.match(inlineTitle);
        //         this._titleRaw = matches[1];
        //     }
        // }
        // if (this._titleRaw) {
        //     this._title = title.Deal(this._titleRaw);
        //     return
        // }
        if (this.start && this.end) {
            // this.title = `${this.fileName}@${this.start.line + 1}-${this.end.line + 1}`;
            if (this.index)
                this._name = `${this.fileName}-${this.index}`;
            else
                this._name = this.fileName;
        }
        else {
            this._name = "";
        }
    }
}
exports.Diagram = Diagram;
//# sourceMappingURL=diagram.js.map
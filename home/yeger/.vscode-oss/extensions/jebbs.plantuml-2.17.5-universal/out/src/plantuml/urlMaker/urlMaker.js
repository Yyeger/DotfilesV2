"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeDiagramURL = exports.MakeDiagramsURL = void 0;
const common_1 = require("../common");
const config_1 = require("../config");
const plantumlURL_1 = require("../plantumlURL");
function MakeDiagramsURL(diagrams, format, bar) {
    return diagrams.map((diagram) => {
        return MakeDiagramURL(diagram, format, bar);
    });
}
exports.MakeDiagramsURL = MakeDiagramsURL;
function MakeDiagramURL(diagram, format, bar) {
    if (bar) {
        bar.show();
        bar.text = (0, common_1.localize)(16, null, diagram.name);
    }
    let server = config_1.config.server(diagram.parentUri);
    return {
        name: diagram.name,
        urls: [...Array(diagram.pageCount).keys()].map(index => (0, plantumlURL_1.makePlantumlURL)(server, diagram, format, index))
    };
}
exports.MakeDiagramURL = MakeDiagramURL;
//# sourceMappingURL=urlMaker.js.map
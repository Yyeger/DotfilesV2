"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plantumlPlugin = void 0;
const render_1 = require("./render");
const rule_1 = require("./rule");
function plantumlPlugin(md) {
    md.renderer.rules.plantuml = render_1.renderHtml;
    md.core.ruler.push("plantuml", rule_1.plantumlWorker);
}
exports.plantumlPlugin = plantumlPlugin;
//# sourceMappingURL=index.js.map
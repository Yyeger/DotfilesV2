"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appliedRender = void 0;
const local_1 = require("../renders/local");
const plantumlServer_1 = require("../renders/plantumlServer");
const config_1 = require("../config");
/**
 * get applied base exporter
 * @returns IBaseExporter of applied exporter
 */
function appliedRender(uri) {
    switch (config_1.config.render(uri)) {
        case config_1.RenderType.Local:
            return local_1.localRender;
        case config_1.RenderType.PlantUMLServer:
            return plantumlServer_1.plantumlServer;
        default:
            return local_1.localRender;
    }
}
exports.appliedRender = appliedRender;
//# sourceMappingURL=appliedRender.js.map
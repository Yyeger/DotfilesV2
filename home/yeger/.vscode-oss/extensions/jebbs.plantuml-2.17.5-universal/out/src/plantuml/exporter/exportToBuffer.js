"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMapData = exports.exportToBuffer = void 0;
const exportDiagram_1 = require("./exportDiagram");
const appliedRender_1 = require("./appliedRender");
/**
 * export diagram to buffer
 * @param diagram the diagram to export.
 * @param format format of export file.
 * @param bar display prcessing message in bar if it's given.
 * @returns ExportTask.
 */
function exportToBuffer(diagram, format, bar) {
    return (0, exportDiagram_1.exportDiagram)(diagram, format, "", bar);
}
exports.exportToBuffer = exportToBuffer;
/**
 * export diagram to buffer
 * @param diagram the diagram to export.
 * @param format format of export file.
 * @param bar display prcessing message in bar if it's given.
 * @returns ExportTask.
 */
function getMapData(diagram) {
    return (0, appliedRender_1.appliedRender)(diagram.parentUri).getMapData(diagram, "");
}
exports.getMapData = getMapData;
//# sourceMappingURL=exportToBuffer.js.map
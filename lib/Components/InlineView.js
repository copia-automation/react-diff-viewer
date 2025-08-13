"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineView = InlineView;
var React = require("react");
var compute_lines_1 = require("../compute-lines");
var getLinesToRender_1 = require("../getLinesToRender");
var Line_1 = require("./Line");
function InlineView(_a) {
    var _b = _a.lineInfo, left = _b.left, right = _b.right, renderProps = _a.renderProps, index = _a.index;
    var content;
    if (left.type === compute_lines_1.DiffType.REMOVED && right.type === compute_lines_1.DiffType.ADDED) {
        return (React.createElement(React.Fragment, { key: index },
            React.createElement("tr", { className: renderProps.styles.line },
                React.createElement(Line_1.Line, { lineNumber: left.lineNumber, type: left.type, prefix: getLinesToRender_1.LineNumberPrefix.LEFT, value: left.value, renderProps: renderProps })),
            React.createElement("tr", { className: renderProps.styles.line },
                React.createElement(Line_1.Line, { lineNumber: null, type: right.type, prefix: getLinesToRender_1.LineNumberPrefix.RIGHT, value: right.value, renderProps: renderProps }))));
    }
    if (left.type === compute_lines_1.DiffType.REMOVED) {
        content = (React.createElement(Line_1.Line, { lineNumber: left.lineNumber, type: left.type, prefix: getLinesToRender_1.LineNumberPrefix.LEFT, value: left.value, renderProps: renderProps, additionalLineNumber: null }));
    }
    if (left.type === compute_lines_1.DiffType.DEFAULT) {
        content = (React.createElement(Line_1.Line, { lineNumber: left.lineNumber, type: left.type, prefix: getLinesToRender_1.LineNumberPrefix.LEFT, value: left.value, renderProps: renderProps, additionalLineNumber: right.lineNumber, additionalPrefix: getLinesToRender_1.LineNumberPrefix.RIGHT }));
    }
    if (right.type === compute_lines_1.DiffType.ADDED) {
        content = (React.createElement(Line_1.Line, { lineNumber: null, type: right.type, prefix: getLinesToRender_1.LineNumberPrefix.RIGHT, value: right.value, renderProps: renderProps, additionalLineNumber: right.lineNumber }));
    }
    return (React.createElement("tr", { key: index, className: renderProps.styles.line }, content));
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplitView = SplitView;
var React = require("react");
var getLinesToRender_1 = require("../getLinesToRender");
var Line_1 = require("./Line");
function SplitView(_a) {
    var _b = _a.lineInfo, left = _b.left, right = _b.right, renderProps = _a.renderProps, index = _a.index;
    return (React.createElement("tr", { key: index, className: renderProps.styles.line },
        React.createElement(Line_1.Line, { lineNumber: left.lineNumber, type: left.type, prefix: getLinesToRender_1.LineNumberPrefix.LEFT, value: left.value, renderProps: renderProps }),
        React.createElement(Line_1.Line, { lineNumber: right.lineNumber, type: right.type, prefix: getLinesToRender_1.LineNumberPrefix.RIGHT, value: right.value, renderProps: renderProps })));
}

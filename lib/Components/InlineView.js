import * as React from "react";
import { DiffType } from "../compute-lines";
import { LineNumberPrefix, } from "../getLinesToRender";
import { Line } from "./Line";
export function InlineView(_a) {
    var _b = _a.lineInfo, left = _b.left, right = _b.right, renderProps = _a.renderProps, index = _a.index;
    var content;
    if (left.type === DiffType.REMOVED && right.type === DiffType.ADDED) {
        return (React.createElement(React.Fragment, { key: index },
            React.createElement("tr", { className: renderProps.styles.line },
                React.createElement(Line, { lineNumber: left.lineNumber, type: left.type, prefix: LineNumberPrefix.LEFT, value: left.value, renderProps: renderProps })),
            React.createElement("tr", { className: renderProps.styles.line },
                React.createElement(Line, { lineNumber: null, type: right.type, prefix: LineNumberPrefix.RIGHT, value: right.value, renderProps: renderProps }))));
    }
    if (left.type === DiffType.REMOVED) {
        content = (React.createElement(Line, { lineNumber: left.lineNumber, type: left.type, prefix: LineNumberPrefix.LEFT, value: left.value, renderProps: renderProps, additionalLineNumber: null }));
    }
    if (left.type === DiffType.DEFAULT) {
        content = (React.createElement(Line, { lineNumber: left.lineNumber, type: left.type, prefix: LineNumberPrefix.LEFT, value: left.value, renderProps: renderProps, additionalLineNumber: right.lineNumber, additionalPrefix: LineNumberPrefix.RIGHT }));
    }
    if (right.type === DiffType.ADDED) {
        content = (React.createElement(Line, { lineNumber: null, type: right.type, prefix: LineNumberPrefix.RIGHT, value: right.value, renderProps: renderProps, additionalLineNumber: right.lineNumber }));
    }
    return (React.createElement("tr", { key: index, className: renderProps.styles.line }, content));
}

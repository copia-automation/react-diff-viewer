import * as React from "react";
import { DiffType } from "../compute-lines";
import { LineNumberPrefix } from "../getLinesToRender";
import { Line } from "./Line";
export function InlineView(_a) {
    var left = _a.left, right = _a.right;
    var content;
    if (left.type === DiffType.REMOVED && right.type === DiffType.ADDED) {
        return (React.createElement(React.Fragment, null,
            React.createElement(Line, { lineNumber: left.lineNumber, type: left.type, prefix: LineNumberPrefix.LEFT, value: left.value }),
            React.createElement(Line, { lineNumber: null, type: right.type, prefix: LineNumberPrefix.RIGHT, value: right.value })));
    }
    if (left.type === DiffType.REMOVED) {
        content = (React.createElement(Line, { lineNumber: left.lineNumber, type: left.type, prefix: LineNumberPrefix.LEFT, value: left.value, additionalLineNumber: null }));
    }
    if (left.type === DiffType.DEFAULT) {
        content = (React.createElement(Line, { lineNumber: left.lineNumber, type: left.type, prefix: LineNumberPrefix.LEFT, value: left.value, additionalLineNumber: right.lineNumber, additionalPrefix: LineNumberPrefix.RIGHT }));
    }
    if (right.type === DiffType.ADDED) {
        content = (React.createElement(Line, { lineNumber: null, type: right.type, prefix: LineNumberPrefix.RIGHT, value: right.value, additionalLineNumber: right.lineNumber }));
    }
    return (React.createElement(React.Fragment, null, content));
}

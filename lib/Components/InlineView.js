import * as React from "react";
import { DiffType } from "../compute-lines";
import { LineNumberPrefix } from "../getLinesToRender";
import { Line } from "./Line";
export function InlineView(_a) {
    var left = _a.left, right = _a.right;
    if (left.type === DiffType.REMOVED && right.type === DiffType.ADDED) {
        return (React.createElement(Line, { lineNumber: left.lineNumber, type: left.type, prefix: LineNumberPrefix.LEFT, value: left.value }));
    }
    if (left.type === DiffType.REMOVED) {
        return (React.createElement(Line, { lineNumber: left.lineNumber, type: left.type, prefix: LineNumberPrefix.LEFT, value: left.value, additionalLineNumber: null }));
    }
    if (left.type === DiffType.DEFAULT) {
        return (React.createElement(Line, { lineNumber: left.lineNumber, type: left.type, prefix: LineNumberPrefix.LEFT, value: left.value, additionalLineNumber: right.lineNumber, additionalPrefix: LineNumberPrefix.RIGHT }));
    }
    if (right.type === DiffType.ADDED) {
        return (React.createElement(Line, { lineNumber: null, type: right.type, prefix: LineNumberPrefix.RIGHT, value: right.value, additionalLineNumber: right.lineNumber }));
    }
    throw new Error("Unreachable");
}

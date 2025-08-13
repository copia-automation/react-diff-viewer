import * as React from "react";
import { LineNumberPrefix } from "../getLinesToRender";
import { Line } from "./Line";
export function SplitView(_a) {
    var left = _a.left, right = _a.right;
    return (React.createElement(React.Fragment, null,
        React.createElement(Line, { lineNumber: left.lineNumber, type: left.type, prefix: LineNumberPrefix.LEFT, value: left.value }),
        React.createElement(Line, { lineNumber: right.lineNumber, type: right.type, prefix: LineNumberPrefix.RIGHT, value: right.value })));
}

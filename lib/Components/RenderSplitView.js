import * as React from "react";
import { LineNumberPrefix, } from "../getLinesToRender";
import { Line } from "./Line";
export function SplitView(_a) {
    var _b = _a.lineInfo, left = _b.left, right = _b.right, renderProps = _a.renderProps, index = _a.index;
    return (React.createElement("tr", { key: index, className: renderProps.styles.line },
        React.createElement(Line, { lineNumber: left.lineNumber, type: left.type, prefix: LineNumberPrefix.LEFT, value: left.value, renderProps: renderProps }),
        React.createElement(Line, { lineNumber: right.lineNumber, type: right.type, prefix: LineNumberPrefix.RIGHT, value: right.value, renderProps: renderProps })));
}

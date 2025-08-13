import { default as cn } from "classnames";
import * as React from "react";
import { useReactDiffViewerContext } from "../context";
export function SkippedLineIndicator(_a) {
    var _b;
    var num = _a.num, blockNumber = _a.blockNumber, leftBlockLineNumber = _a.leftBlockLineNumber, rightBlockLineNumber = _a.rightBlockLineNumber, expandBlockById = _a.expandBlockById;
    var _c = useReactDiffViewerContext(), codeFoldMessageRenderer = _c.codeFoldMessageRenderer, hideLineNumbers = _c.hideLineNumbers, splitView = _c.splitView, styles = _c.styles;
    var message = codeFoldMessageRenderer ? (codeFoldMessageRenderer(num, leftBlockLineNumber, rightBlockLineNumber)) : (React.createElement("pre", { className: styles.codeFoldContent },
        "Expand ",
        num,
        " lines ..."));
    var content = (React.createElement("td", null,
        React.createElement("a", { onClick: function () {
                expandBlockById(blockNumber);
            }, tabIndex: 0 }, message)));
    var isUnifiedViewWithoutLineNumbers = !splitView && !hideLineNumbers;
    return (React.createElement(React.Fragment, null,
        !hideLineNumbers && React.createElement("td", { className: styles.codeFoldGutter }),
        React.createElement("td", { className: cn((_b = {},
                _b[styles.codeFoldGutter] = isUnifiedViewWithoutLineNumbers,
                _b)) }),
        isUnifiedViewWithoutLineNumbers ? (React.createElement(React.Fragment, null,
            React.createElement("td", null),
            content)) : (React.createElement(React.Fragment, null,
            content,
            React.createElement("td", null))),
        React.createElement("td", null),
        React.createElement("td", null)));
}

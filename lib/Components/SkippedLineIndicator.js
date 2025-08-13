import { default as cn } from "classnames";
import * as React from "react";
export function SkippedLineIndicator(_a) {
    var _b;
    var num = _a.num, blockNumber = _a.blockNumber, leftBlockLineNumber = _a.leftBlockLineNumber, rightBlockLineNumber = _a.rightBlockLineNumber, renderProps = _a.renderProps, expandBlockById = _a.expandBlockById;
    var codeFoldMessageRenderer = renderProps.codeFoldMessageRenderer, hideLineNumbers = renderProps.hideLineNumbers, splitView = renderProps.splitView;
    var message = codeFoldMessageRenderer ? (codeFoldMessageRenderer(num, leftBlockLineNumber, rightBlockLineNumber)) : (React.createElement("pre", { className: renderProps.styles.codeFoldContent },
        "Expand ",
        num,
        " lines ..."));
    var content = (React.createElement("td", null,
        React.createElement("a", { onClick: function () {
                expandBlockById(blockNumber);
            }, tabIndex: 0 }, message)));
    var isUnifiedViewWithoutLineNumbers = !splitView && !hideLineNumbers;
    return (React.createElement(React.Fragment, null,
        !hideLineNumbers && React.createElement("td", { className: renderProps.styles.codeFoldGutter }),
        React.createElement("td", { className: cn((_b = {},
                _b[renderProps.styles.codeFoldGutter] = isUnifiedViewWithoutLineNumbers,
                _b)) }),
        isUnifiedViewWithoutLineNumbers ? (React.createElement(React.Fragment, null,
            React.createElement("td", null),
            content)) : (React.createElement(React.Fragment, null,
            content,
            React.createElement("td", null))),
        React.createElement("td", null),
        React.createElement("td", null)));
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkippedLineIndicator = SkippedLineIndicator;
var classnames_1 = require("classnames");
var React = require("react");
var helpers_1 = require("../helpers");
function SkippedLineIndicator(_a) {
    var _b;
    var num = _a.num, blockNumber = _a.blockNumber, leftBlockLineNumber = _a.leftBlockLineNumber, rightBlockLineNumber = _a.rightBlockLineNumber, renderProps = _a.renderProps, expandBlockIdsSet = _a.expandBlockIdsSet, setExpandedBlockIdsSet = _a.setExpandedBlockIdsSet;
    var codeFoldMessageRenderer = renderProps.codeFoldMessageRenderer, hideLineNumbers = renderProps.hideLineNumbers, splitView = renderProps.splitView;
    var message = codeFoldMessageRenderer ? (codeFoldMessageRenderer(num, leftBlockLineNumber, rightBlockLineNumber)) : (React.createElement("pre", { className: renderProps.styles.codeFoldContent },
        "Expand ",
        num,
        " lines ..."));
    var content = (React.createElement("td", null,
        React.createElement("a", { onClick: function () {
                (0, helpers_1.expandBlock)(blockNumber, expandBlockIdsSet, function (newState) {
                    return setExpandedBlockIdsSet(newState);
                });
            }, tabIndex: 0 }, message)));
    var isUnifiedViewWithoutLineNumbers = !splitView && !hideLineNumbers;
    return (React.createElement("tr", { key: "".concat(leftBlockLineNumber, "-").concat(rightBlockLineNumber), className: renderProps.styles.codeFold },
        !hideLineNumbers && React.createElement("td", { className: renderProps.styles.codeFoldGutter }),
        React.createElement("td", { className: (0, classnames_1.default)((_b = {},
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

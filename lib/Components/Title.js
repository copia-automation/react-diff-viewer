import * as React from "react";
export function Title(_a) {
    var hideLineNumbers = _a.hideLineNumbers, leftTitle = _a.leftTitle, rightTitle = _a.rightTitle, splitView = _a.splitView, styles = _a.styles, largestPossibleLineNumber = _a.largestPossibleLineNumber;
    if (!leftTitle && !rightTitle)
        return React.createElement(React.Fragment, null);
    var colSpanOnSplitView = hideLineNumbers ? 2 : 3;
    var colSpanOnInlineView = hideLineNumbers ? 2 : 4;
    var largestLineNumberCharacters = String(largestPossibleLineNumber).length;
    var gutterWidth = largestLineNumberCharacters * 7 + 20;
    return (React.createElement(React.Fragment, null,
        React.createElement("tr", { style: { height: 0 } },
            !hideLineNumbers && React.createElement("td", { style: { width: gutterWidth } }),
            React.createElement("td", { style: { width: 29 } }),
            React.createElement("td", null),
            splitView && (React.createElement(React.Fragment, null,
                !hideLineNumbers && React.createElement("td", { style: { width: gutterWidth } }),
                React.createElement("td", { style: { width: 29 } }),
                React.createElement("td", null)))),
        React.createElement("tr", null,
            React.createElement("td", { colSpan: splitView ? colSpanOnSplitView : colSpanOnInlineView, className: styles.titleBlock },
                React.createElement("pre", { className: styles.contentText }, leftTitle)),
            splitView && (React.createElement("td", { colSpan: colSpanOnSplitView, className: styles.titleBlock },
                React.createElement("pre", { className: styles.contentText }, rightTitle))))));
}

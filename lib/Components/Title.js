import * as React from "react";
export function Title(_a) {
    var hideLineNumbers = _a.hideLineNumbers, leftTitle = _a.leftTitle, rightTitle = _a.rightTitle, splitView = _a.splitView, styles = _a.styles;
    if (!leftTitle && !rightTitle)
        return React.createElement(React.Fragment, null);
    var colSpanOnSplitView = hideLineNumbers ? 2 : 3;
    var colSpanOnInlineView = hideLineNumbers ? 2 : 4;
    return (React.createElement("tr", null,
        React.createElement("td", { colSpan: splitView ? colSpanOnSplitView : colSpanOnInlineView, className: styles.titleBlock },
            React.createElement("pre", { className: styles.contentText }, leftTitle)),
        splitView && (React.createElement("td", { colSpan: colSpanOnSplitView, className: styles.titleBlock },
            React.createElement("pre", { className: styles.contentText }, rightTitle)))));
}

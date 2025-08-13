import * as React from "react";
import { useReactDiffViewerContext } from "../context";
/**
 * We need an alignment row since we're now using the css
 * property "table-style: fixed". Since the header will always render,
 * this allows our column widths to remain consistent even on virtual.
 *
 * This is in "fixed" mode the first row sets all column widths
 */
function AlignmentRow(_a) {
    var largestPossibleLineNumber = _a.largestPossibleLineNumber;
    var _b = useReactDiffViewerContext(), hideLineNumbers = _b.hideLineNumbers, splitView = _b.splitView;
    var largestLineNumberCharacters = String(largestPossibleLineNumber).length;
    var gutterWidth = largestLineNumberCharacters * 10 + 20;
    return (React.createElement("tr", { style: { height: 0 } },
        !hideLineNumbers && React.createElement("td", { style: { width: gutterWidth } }),
        React.createElement("td", { style: { width: 29 } }),
        React.createElement("td", null),
        splitView && (React.createElement(React.Fragment, null,
            !hideLineNumbers && React.createElement("td", { style: { width: gutterWidth } }),
            React.createElement("td", { style: { width: 29 } }),
            React.createElement("td", null)))));
}
function TitleText() {
    var _a = useReactDiffViewerContext(), hideLineNumbers = _a.hideLineNumbers, leftTitle = _a.leftTitle, rightTitle = _a.rightTitle, splitView = _a.splitView, styles = _a.styles;
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
export function Title(_a) {
    var largestPossibleLineNumber = _a.largestPossibleLineNumber;
    return (React.createElement(React.Fragment, null,
        React.createElement(AlignmentRow, { largestPossibleLineNumber: largestPossibleLineNumber }),
        React.createElement(TitleText, null)));
}

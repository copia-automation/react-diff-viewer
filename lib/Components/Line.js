import { default as cn } from "classnames";
import * as React from "react";
import { DiffType } from "../compute-lines";
import { WordDiff } from "./WordDiff";
import { useReactDiffViewerContext } from "../context";
export function Line(_a) {
    var _b, _c, _d, _e;
    var lineNumber = _a.lineNumber, type = _a.type, prefix = _a.prefix, value = _a.value, additionalLineNumber = _a.additionalLineNumber, additionalPrefix = _a.additionalPrefix;
    var _f = useReactDiffViewerContext(), highlightLines = _f.highlightLines, renderContent = _f.renderContent, styles = _f.styles, onLineNumberClick = _f.onLineNumberClick, splitView = _f.splitView, hideLineNumbers = _f.hideLineNumbers;
    var lineNumberTemplate = "".concat(prefix, "-").concat(lineNumber);
    var additionalLineNumberTemplate = "".concat(additionalPrefix, "-").concat(additionalLineNumber);
    var highlightLine = highlightLines.includes(lineNumberTemplate) ||
        highlightLines.includes(additionalLineNumberTemplate);
    var added = type === DiffType.ADDED;
    var removed = type === DiffType.REMOVED;
    var content;
    if (Array.isArray(value)) {
        content = React.createElement(WordDiff, { diffArray: value });
    }
    else if (renderContent) {
        content = renderContent(value);
    }
    else {
        content = value;
    }
    function onLineNumberClickProxy(id) {
        if (onLineNumberClick) {
            return function (e) {
                return onLineNumberClick(id, e);
            };
        }
        return function () { };
    }
    return (React.createElement(React.Fragment, null,
        !hideLineNumbers && (React.createElement("td", { onClick: lineNumber && onLineNumberClickProxy(lineNumberTemplate), className: cn(styles.gutter, (_b = {},
                _b[styles.emptyGutter] = !lineNumber,
                _b[styles.diffAdded] = added,
                _b[styles.diffRemoved] = removed,
                _b[styles.highlightedGutter] = highlightLine,
                _b)) },
            React.createElement("pre", { className: styles.lineNumber }, lineNumber))),
        !splitView && !hideLineNumbers && (React.createElement("td", { onClick: additionalLineNumber &&
                onLineNumberClickProxy(additionalLineNumberTemplate), className: cn(styles.gutter, (_c = {},
                _c[styles.emptyGutter] = !additionalLineNumber,
                _c[styles.diffAdded] = added,
                _c[styles.diffRemoved] = removed,
                _c[styles.highlightedGutter] = highlightLine,
                _c)) },
            React.createElement("pre", { className: styles.lineNumber }, additionalLineNumber))),
        React.createElement("td", { className: cn(styles.marker, (_d = {},
                _d[styles.emptyLine] = !content,
                _d[styles.diffAdded] = added,
                _d[styles.diffRemoved] = removed,
                _d[styles.highlightedLine] = highlightLine,
                _d)) },
            React.createElement("pre", null,
                added && "+",
                removed && "-")),
        React.createElement("td", { className: cn(styles.content, (_e = {},
                _e[styles.emptyLine] = !content,
                _e[styles.diffAdded] = added,
                _e[styles.diffRemoved] = removed,
                _e[styles.highlightedLine] = highlightLine,
                _e)) },
            React.createElement("pre", { className: styles.contentText }, content))));
}

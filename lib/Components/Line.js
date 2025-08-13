import { default as cn } from "classnames";
import * as React from "react";
import { DiffType } from "../compute-lines";
import { WordDiff } from "./WordDiff";
export function Line(_a) {
    var _b, _c, _d, _e;
    var lineNumber = _a.lineNumber, type = _a.type, prefix = _a.prefix, value = _a.value, additionalLineNumber = _a.additionalLineNumber, additionalPrefix = _a.additionalPrefix, renderProps = _a.renderProps;
    var lineNumberTemplate = "".concat(prefix, "-").concat(lineNumber);
    var additionalLineNumberTemplate = "".concat(additionalPrefix, "-").concat(additionalLineNumber);
    var highlightLine = renderProps.highlightLines.includes(lineNumberTemplate) ||
        renderProps.highlightLines.includes(additionalLineNumberTemplate);
    var added = type === DiffType.ADDED;
    var removed = type === DiffType.REMOVED;
    var content;
    if (Array.isArray(value)) {
        content = (React.createElement(WordDiff, { diffArray: value, renderer: renderProps.renderContent, styles: renderProps.styles }));
    }
    else if (renderProps.renderContent) {
        content = renderProps.renderContent(value);
    }
    else {
        content = value;
    }
    function onLineNumberClickProxy(id) {
        if (renderProps.onLineNumberClick) {
            return function (e) {
                return renderProps.onLineNumberClick(id, e);
            };
        }
        return function () { };
    }
    return (React.createElement(React.Fragment, null,
        !renderProps.hideLineNumbers && (React.createElement("td", { onClick: lineNumber && onLineNumberClickProxy(lineNumberTemplate), className: cn(renderProps.styles.gutter, (_b = {},
                _b[renderProps.styles.emptyGutter] = !lineNumber,
                _b[renderProps.styles.diffAdded] = added,
                _b[renderProps.styles.diffRemoved] = removed,
                _b[renderProps.styles.highlightedGutter] = highlightLine,
                _b)) },
            React.createElement("pre", { className: renderProps.styles.lineNumber }, lineNumber))),
        !renderProps.splitView && !renderProps.hideLineNumbers && (React.createElement("td", { onClick: additionalLineNumber &&
                onLineNumberClickProxy(additionalLineNumberTemplate), className: cn(renderProps.styles.gutter, (_c = {},
                _c[renderProps.styles.emptyGutter] = !additionalLineNumber,
                _c[renderProps.styles.diffAdded] = added,
                _c[renderProps.styles.diffRemoved] = removed,
                _c[renderProps.styles.highlightedGutter] = highlightLine,
                _c)) },
            React.createElement("pre", { className: renderProps.styles.lineNumber }, additionalLineNumber))),
        React.createElement("td", { className: cn(renderProps.styles.marker, (_d = {},
                _d[renderProps.styles.emptyLine] = !content,
                _d[renderProps.styles.diffAdded] = added,
                _d[renderProps.styles.diffRemoved] = removed,
                _d[renderProps.styles.highlightedLine] = highlightLine,
                _d)) },
            React.createElement("pre", null,
                added && "+",
                removed && "-")),
        React.createElement("td", { className: cn(renderProps.styles.content, (_e = {},
                _e[renderProps.styles.emptyLine] = !content,
                _e[renderProps.styles.diffAdded] = added,
                _e[renderProps.styles.diffRemoved] = removed,
                _e[renderProps.styles.highlightedLine] = highlightLine,
                _e)) },
            React.createElement("pre", { className: renderProps.styles.contentText }, content))));
}

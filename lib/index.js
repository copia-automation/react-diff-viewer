var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import * as React from "react";
import cn from "classnames";
import { DiffMethod } from "./compute-lines";
import computeStyles from "./Components/styles";
import { Title } from "./Components/Title";
import { SplitView } from "./Components/SplitView";
import { Node } from "./Components/Node";
import { InlineView } from "./Components/InlineView";
import { SkippedLineIndicator } from "./Components/SkippedLineIndicator";
import { TableVirtuoso } from "react-virtuoso";
import { ReactDiffViewerContextProvider, useReactDiffViewerContext, } from "./context";
function RenderLineFromProps(_a) {
    var line = _a.line, expandBlockById = _a.expandBlockById;
    var splitView = useReactDiffViewerContext().splitView;
    if ("num" in line) {
        return React.createElement(SkippedLineIndicator, __assign({}, line, { expandBlockById: expandBlockById }));
    }
    if (splitView) {
        return React.createElement(SplitView, __assign({}, line));
    }
    return React.createElement(InlineView, __assign({}, line));
}
var TableRowWithRef = React.forwardRef(function (props, ref) {
    var _a;
    var styles = useReactDiffViewerContext().styles;
    var item = props.item;
    var classNames = cn((_a = {},
        _a[styles.codeFold] = "num" in item,
        _a[styles.line] = !("num" in item),
        _a));
    return React.createElement("tr", __assign({ ref: ref, className: classNames }, props));
});
TableRowWithRef.displayName = "TableRowWithRef";
function TableRow(props) {
    var diffIndex = props.item.diffIndex;
    return (React.createElement(Node, { index: diffIndex },
        React.createElement(TableRowWithRef, __assign({}, props))));
}
function DiffViewer(_a) {
    var _b = _a.oldValue, oldValue = _b === void 0 ? "" : _b, _c = _a.newValue, newValue = _c === void 0 ? "" : _c, _d = _a.splitView, splitView = _d === void 0 ? true : _d, _e = _a.highlightLines, highlightLines = _e === void 0 ? [] : _e, _f = _a.disableWordDiff, disableWordDiff = _f === void 0 ? false : _f, _g = _a.compareMethod, compareMethod = _g === void 0 ? DiffMethod.CHARS : _g, _h = _a.styles, styleOverrides = _h === void 0 ? {} : _h, _j = _a.hideLineNumbers, hideLineNumbers = _j === void 0 ? false : _j, _k = _a.extraLinesSurroundingDiff, extraLinesSurroundingDiff = _k === void 0 ? 3 : _k, _l = _a.showDiffOnly, showDiffOnly = _l === void 0 ? true : _l, _m = _a.useDarkTheme, useDarkTheme = _m === void 0 ? false : _m, _o = _a.linesOffset, linesOffset = _o === void 0 ? 0 : _o, LoadingIndicator = _a.LoadingIndicator, ErrorDisplay = _a.ErrorDisplay, rest = __rest(_a, ["oldValue", "newValue", "splitView", "highlightLines", "disableWordDiff", "compareMethod", "styles", "hideLineNumbers", "extraLinesSurroundingDiff", "showDiffOnly", "useDarkTheme", "linesOffset", "LoadingIndicator", "ErrorDisplay"]);
    var _p = __read(React.useState(new Set()), 2), expandedBlockIdsSet = _p[0], setExpandedBlockIdsSet = _p[1];
    var _q = __read(React.useState(null), 2), errorMessage = _q[0], setErrorMessage = _q[1];
    var _r = __read(React.useState(true), 2), loading = _r[0], setLoading = _r[1];
    var _s = __read(React.useState([]), 2), linesToRender = _s[0], setLinesToRender = _s[1];
    function expandBlockById(blockId) {
        var newState = new Set(__spreadArray(__spreadArray([], __read(Array.from(expandedBlockIdsSet)), false), [
            blockId,
        ], false));
        setExpandedBlockIdsSet(newState);
    }
    var props = __assign({ oldValue: oldValue, newValue: newValue, splitView: splitView, highlightLines: highlightLines, disableWordDiff: disableWordDiff, compareMethod: compareMethod, styles: styleOverrides, hideLineNumbers: hideLineNumbers, extraLinesSurroundingDiff: extraLinesSurroundingDiff, showDiffOnly: showDiffOnly, useDarkTheme: useDarkTheme, linesOffset: linesOffset }, rest);
    if (typeof oldValue !== "string" || typeof newValue !== "string") {
        throw Error('"oldValue" and "newValue" should be strings');
    }
    var styles = React.useMemo(function () { return computeStyles(props.styles, useDarkTheme); }, [props.styles, useDarkTheme]);
    var renderProps = React.useMemo(function () { return (__assign(__assign({}, props), { styles: styles })); }, [props, styles]);
    React.useEffect(function () {
        var worker = new Worker(new URL("./getLinesToRender.worker.js", import.meta.url));
        worker.onmessage = function (e) {
            var _a = e.data, success = _a.success, data = _a.data, error = _a.error;
            if (success) {
                setLinesToRender(data);
            }
            else {
                setErrorMessage(error);
            }
            setLoading(false);
        };
        worker.postMessage({
            oldValue: oldValue,
            newValue: newValue,
            disableWordDiff: disableWordDiff,
            compareMethod: compareMethod,
            linesOffset: linesOffset,
            extraLinesSurroundingDiff: extraLinesSurroundingDiff,
            showDiffOnly: showDiffOnly,
            expandedBlockIdsSet: expandedBlockIdsSet,
        });
        return function () {
            worker.terminate();
        };
    }, [
        oldValue,
        newValue,
        disableWordDiff,
        compareMethod,
        linesOffset,
        extraLinesSurroundingDiff,
        showDiffOnly,
        expandedBlockIdsSet,
    ]);
    var largestLineNumber = React.useMemo(function () {
        return Math.max(oldValue.split("\n").length + 1, newValue.split("\n").length + 1);
    }, [oldValue, newValue]);
    if (errorMessage) {
        if (ErrorDisplay) {
            return React.createElement(ErrorDisplay, { errorMessage: errorMessage });
        }
        return (React.createElement("div", { style: {
                background: "#fff",
                border: "1px solid #ff0000",
                width: "100%",
                height: "100%",
                borderRadius: 2,
            } },
            React.createElement("p", null, errorMessage)));
    }
    if (loading) {
        if (LoadingIndicator) {
            return React.createElement(LoadingIndicator, null);
        }
        return (React.createElement("div", { style: {
                background: "#fff",
                width: "100%",
                height: "100%",
            } },
            React.createElement("p", null, "Loading...")));
    }
    return (React.createElement(ReactDiffViewerContextProvider, { value: renderProps },
        React.createElement(TableVirtuoso, { style: {
                width: "100%",
                maxHeight: "100%",
                height: 1000,
            }, data: linesToRender, fixedHeaderContent: function () { return (React.createElement(Title, __assign({}, renderProps, { largestPossibleLineNumber: largestLineNumber }))); }, itemContent: function (index, line) { return (React.createElement(RenderLineFromProps, { key: index, line: line, expandBlockById: expandBlockById })); }, components: {
                Table: function (props) {
                    var _a;
                    return (React.createElement("table", __assign({}, props, { className: cn(styles.diffContainer, (_a = {},
                            _a[styles.splitView] = splitView,
                            _a)), style: {
                            tableLayout: "fixed",
                        } })));
                },
                TableRow: TableRow,
            } })));
}
export default DiffViewer;
export { DiffMethod };

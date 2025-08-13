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
import { SplitView } from "./Components/RenderSplitView";
import { Node } from "./Components/Node";
import { InlineView } from "./Components/InlineView";
import { SkippedLineIndicator } from "./Components/SkippedLineIndicator";
import { TableVirtuoso } from "react-virtuoso";
function RenderLineFromProps(_a) {
    var line = _a.line, i = _a.i, expandBlockById = _a.expandBlockById, renderProps = _a.renderProps;
    if ("num" in line) {
        return (React.createElement(Node, { key: i, index: i, renderNodeWrapper: renderProps.renderNodeWrapper },
            React.createElement(SkippedLineIndicator, __assign({}, line, { renderProps: renderProps, expandBlockById: expandBlockById }))));
    }
    var lineIndex = line.index, lineProps = __rest(line, ["index"]);
    if (renderProps.splitView) {
        return (React.createElement(Node, { key: i, index: i, renderNodeWrapper: renderProps.renderNodeWrapper },
            React.createElement(SplitView, { lineInfo: lineProps, renderProps: renderProps, index: lineIndex })));
    }
    return (React.createElement(Node, { key: i, index: i, renderNodeWrapper: renderProps.renderNodeWrapper },
        React.createElement(InlineView, { lineInfo: lineProps, renderProps: renderProps, index: lineIndex })));
}
function DiffViewer(_a) {
    var _b;
    var _c = _a.oldValue, oldValue = _c === void 0 ? "" : _c, _d = _a.newValue, newValue = _d === void 0 ? "" : _d, _e = _a.splitView, splitView = _e === void 0 ? true : _e, _f = _a.highlightLines, highlightLines = _f === void 0 ? [] : _f, _g = _a.disableWordDiff, disableWordDiff = _g === void 0 ? false : _g, _h = _a.compareMethod, compareMethod = _h === void 0 ? DiffMethod.CHARS : _h, _j = _a.styles, styleOverrides = _j === void 0 ? {} : _j, _k = _a.hideLineNumbers, hideLineNumbers = _k === void 0 ? false : _k, _l = _a.extraLinesSurroundingDiff, extraLinesSurroundingDiff = _l === void 0 ? 3 : _l, _m = _a.showDiffOnly, showDiffOnly = _m === void 0 ? true : _m, _o = _a.useDarkTheme, useDarkTheme = _o === void 0 ? false : _o, _p = _a.linesOffset, linesOffset = _p === void 0 ? 0 : _p, LoadingIndicator = _a.LoadingIndicator, ErrorDisplay = _a.ErrorDisplay, rest = __rest(_a, ["oldValue", "newValue", "splitView", "highlightLines", "disableWordDiff", "compareMethod", "styles", "hideLineNumbers", "extraLinesSurroundingDiff", "showDiffOnly", "useDarkTheme", "linesOffset", "LoadingIndicator", "ErrorDisplay"]);
    var _q = __read(React.useState(new Set()), 2), expandedBlockIdsSet = _q[0], setExpandedBlockIdsSet = _q[1];
    var _r = __read(React.useState(null), 2), errorMessage = _r[0], setErrorMessage = _r[1];
    var _s = __read(React.useState(true), 2), loading = _s[0], setLoading = _s[1];
    var _t = __read(React.useState([]), 2), linesToRender = _t[0], setLinesToRender = _t[1];
    function expandBlockById(blockId) {
        var newState = new Set(__spreadArray(__spreadArray([], __read(Array.from(expandedBlockIdsSet)), false), [
            blockId,
        ], false));
        setExpandedBlockIdsSet(newState);
    }
    React.useEffect(function () {
        console.log({ expandedBlockIdsSet: expandedBlockIdsSet });
    }, [expandedBlockIdsSet]);
    var props = __assign({ oldValue: oldValue, newValue: newValue, splitView: splitView, highlightLines: highlightLines, disableWordDiff: disableWordDiff, compareMethod: compareMethod, styles: styleOverrides, hideLineNumbers: hideLineNumbers, extraLinesSurroundingDiff: extraLinesSurroundingDiff, showDiffOnly: showDiffOnly, useDarkTheme: useDarkTheme, linesOffset: linesOffset }, rest);
    if (typeof oldValue !== "string" || typeof newValue !== "string") {
        throw Error('"oldValue" and "newValue" should be strings');
    }
    var styles = React.useMemo(function () { return computeStyles(props.styles, useDarkTheme); }, [props.styles, useDarkTheme]);
    var renderProps = React.useMemo(function () { return (__assign(__assign({}, props), { styles: styles })); }, [props, styles]);
    React.useEffect(function () {
        setLoading(true);
        setErrorMessage(null);
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
            oldValue: oldValue.slice(0, 10000),
            newValue: newValue.slice(0, 10000),
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
    return (React.createElement(TableVirtuoso, { style: {
            width: "100%",
            height: "100%",
            minHeight: 400,
        }, data: linesToRender, fixedHeaderContent: function () { return React.createElement(Title, __assign({}, renderProps)); }, itemContent: function (index, line) { return (React.createElement(RenderLineFromProps, { key: index, line: line, i: index, expandBlockById: expandBlockById, renderProps: renderProps })); }, components: {
            Table: function (props) {
                var _a;
                return (React.createElement("table", __assign({}, props, { className: cn(styles.diffContainer, (_a = {},
                        _a[styles.splitView] = splitView,
                        _a)), style: {
                    // tableLayout: "fixed",
                    } })));
            },
            TableRow: function (props) {
                var _a;
                // @ts-expect-error Haven't figured out props typing yet
                var item = props === null || props === void 0 ? void 0 : props.item;
                var classNames = cn((_a = {},
                    _a[styles.codeFold] = "num" in item,
                    _a));
                return React.createElement("tr", __assign({ className: classNames }, props));
            },
        } }));
    return (React.createElement("table", { className: cn(styles.diffContainer, (_b = {},
            _b[styles.splitView] = splitView,
            _b)) },
        React.createElement("tbody", null,
            React.createElement(Title, __assign({}, renderProps)),
            linesToRender.slice(0, 100).map(function (line, i) { return (React.createElement(RenderLineFromProps, { key: i, line: line, i: i, expandBlockById: expandBlockById, renderProps: renderProps })); }))));
}
export default DiffViewer;
export { DiffMethod };

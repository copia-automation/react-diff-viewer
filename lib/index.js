"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiffMethod = void 0;
var React = require("react");
var classnames_1 = require("classnames");
var helpers_1 = require("./helpers");
var compute_lines_1 = require("./compute-lines");
Object.defineProperty(exports, "DiffMethod", { enumerable: true, get: function () { return compute_lines_1.DiffMethod; } });
var styles_1 = require("./styles");
var getLinesToRender_1 = require("./getLinesToRender");
// import type { SkippedLineProps, }
var expandBlock = helpers_1.default.expandBlock;
// interface ReactDiffViewerRenderProps extends ReactDiffViewerProps {
// 	styles: ReactDiffViewerStyles;
// }
function WordDiff(_a) {
    var diffArray = _a.diffArray, renderer = _a.renderer, styles = _a.styles;
    // private renderWordDiff = (
    // 	diffArray: DiffInformation[],
    // 	renderer?: (chunk: string) => React.ReactElement,
    // ): React.ReactElement[] => {
    return diffArray.map(function (wordDiff, i) {
        var _a;
        return (React.createElement("span", { key: i, className: (0, classnames_1.default)(styles.wordDiff, (_a = {},
                _a[styles.wordAdded] = wordDiff.type === compute_lines_1.DiffType.ADDED,
                _a[styles.wordRemoved] = wordDiff.type === compute_lines_1.DiffType.REMOVED,
                _a)) }, renderer
            ? renderer(wordDiff.value)
            : wordDiff.value));
    });
}
function RenderLine(_a) {
    var _b, _c, _d, _e;
    var lineNumber = _a.lineNumber, type = _a.type, prefix = _a.prefix, value = _a.value, additionalLineNumber = _a.additionalLineNumber, additionalPrefix = _a.additionalPrefix, renderProps = _a.renderProps;
    var lineNumberTemplate = "".concat(prefix, "-").concat(lineNumber);
    var additionalLineNumberTemplate = "".concat(additionalPrefix, "-").concat(additionalLineNumber);
    var highlightLine = renderProps.highlightLines.includes(lineNumberTemplate)
        || renderProps.highlightLines.includes(additionalLineNumberTemplate);
    var added = type === compute_lines_1.DiffType.ADDED;
    var removed = type === compute_lines_1.DiffType.REMOVED;
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
            return function (e) { return renderProps.onLineNumberClick(id, e); };
        }
        return function () { };
    }
    return (React.createElement(React.Fragment, null,
        !renderProps.hideLineNumbers && (React.createElement("td", { onClick: lineNumber && onLineNumberClickProxy(lineNumberTemplate), className: (0, classnames_1.default)(renderProps.styles.gutter, (_b = {},
                _b[renderProps.styles.emptyGutter] = !lineNumber,
                _b[renderProps.styles.diffAdded] = added,
                _b[renderProps.styles.diffRemoved] = removed,
                _b[renderProps.styles.highlightedGutter] = highlightLine,
                _b)) },
            React.createElement("pre", { className: renderProps.styles.lineNumber }, lineNumber))),
        !renderProps.splitView && !renderProps.hideLineNumbers && (React.createElement("td", { onClick: additionalLineNumber
                && onLineNumberClickProxy(additionalLineNumberTemplate), className: (0, classnames_1.default)(renderProps.styles.gutter, (_c = {},
                _c[renderProps.styles.emptyGutter] = !additionalLineNumber,
                _c[renderProps.styles.diffAdded] = added,
                _c[renderProps.styles.diffRemoved] = removed,
                _c[renderProps.styles.highlightedGutter] = highlightLine,
                _c)) },
            React.createElement("pre", { className: renderProps.styles.lineNumber }, additionalLineNumber))),
        React.createElement("td", { className: (0, classnames_1.default)(renderProps.styles.marker, (_d = {},
                _d[renderProps.styles.emptyLine] = !content,
                _d[renderProps.styles.diffAdded] = added,
                _d[renderProps.styles.diffRemoved] = removed,
                _d[renderProps.styles.highlightedLine] = highlightLine,
                _d)) },
            React.createElement("pre", null,
                added && '+',
                removed && '-')),
        React.createElement("td", { className: (0, classnames_1.default)(renderProps.styles.content, (_e = {},
                _e[renderProps.styles.emptyLine] = !content,
                _e[renderProps.styles.diffAdded] = added,
                _e[renderProps.styles.diffRemoved] = removed,
                _e[renderProps.styles.highlightedLine] = highlightLine,
                _e)) },
            React.createElement("pre", { className: renderProps.styles.contentText }, content))));
}
function RenderSplitView(_a) {
    var _b = _a.lineInfo, left = _b.left, right = _b.right, renderProps = _a.renderProps, index = _a.index;
    return (React.createElement("tr", { key: index, className: renderProps.styles.line },
        React.createElement(RenderLine, { lineNumber: left.lineNumber, type: left.type, prefix: getLinesToRender_1.LineNumberPrefix.LEFT, value: left.value, renderProps: renderProps }),
        React.createElement(RenderLine, { lineNumber: right.lineNumber, type: right.type, prefix: getLinesToRender_1.LineNumberPrefix.RIGHT, value: right.value, renderProps: renderProps })));
}
function RenderNode(_a) {
    var renderNodeWrapper = _a.renderNodeWrapper, index = _a.index, children = _a.children;
    if (renderNodeWrapper) {
        return React.createElement(React.Fragment, null, renderNodeWrapper(children, index));
    }
    return React.createElement(React.Fragment, null, children);
}
function RenderInlineView(_a) {
    var _b = _a.lineInfo, left = _b.left, right = _b.right, renderProps = _a.renderProps, index = _a.index;
    var content;
    if (left.type === compute_lines_1.DiffType.REMOVED && right.type === compute_lines_1.DiffType.ADDED) {
        return (React.createElement(React.Fragment, { key: index },
            React.createElement("tr", { className: renderProps.styles.line },
                React.createElement(RenderLine, { lineNumber: left.lineNumber, type: left.type, prefix: getLinesToRender_1.LineNumberPrefix.LEFT, value: left.value, renderProps: renderProps })),
            React.createElement("tr", { className: renderProps.styles.line },
                React.createElement(RenderLine, { lineNumber: null, type: right.type, prefix: getLinesToRender_1.LineNumberPrefix.RIGHT, value: right.value, renderProps: renderProps }))));
    }
    if (left.type === compute_lines_1.DiffType.REMOVED) {
        content = (React.createElement(RenderLine, { lineNumber: left.lineNumber, type: left.type, prefix: getLinesToRender_1.LineNumberPrefix.LEFT, value: left.value, renderProps: renderProps, additionalLineNumber: null }));
        // this.renderLine(
        // 	left.lineNumber,
        // 	left.type,
        // 	LineNumberPrefix.LEFT,
        // 	left.value,
        // 	styles,
        // 	null,
        // );
    }
    if (left.type === compute_lines_1.DiffType.DEFAULT) {
        content = (React.createElement(RenderLine, { lineNumber: left.lineNumber, type: left.type, prefix: getLinesToRender_1.LineNumberPrefix.LEFT, value: left.value, renderProps: renderProps, additionalLineNumber: right.lineNumber, additionalPrefix: getLinesToRender_1.LineNumberPrefix.RIGHT }));
        // this.renderLine(
        // 	left.lineNumber,
        // 	left.type,
        // 	LineNumberPrefix.LEFT,
        // 	left.value,
        // 	styles,
        // 	right.lineNumber,
        // 	LineNumberPrefix.RIGHT,
        // );
    }
    if (right.type === compute_lines_1.DiffType.ADDED) {
        content = (React.createElement(RenderLine, { lineNumber: null, type: right.type, prefix: getLinesToRender_1.LineNumberPrefix.RIGHT, value: right.value, renderProps: renderProps, additionalLineNumber: right.lineNumber }));
        // content = this.renderLine(
        // 	null,
        // 	right.type,
        // 	LineNumberPrefix.RIGHT,
        // 	right.value,
        // 	styles,
        // 	right.lineNumber,
        // );
    }
    return (React.createElement("tr", { key: index, className: renderProps.styles.line }, content));
}
function RenderSkippedLineIndicator(_a) {
    var _b;
    var num = _a.num, blockNumber = _a.blockNumber, leftBlockLineNumber = _a.leftBlockLineNumber, rightBlockLineNumber = _a.rightBlockLineNumber, renderProps = _a.renderProps, expandBlockIdsSet = _a.expandBlockIdsSet, setExpandedBlockIdsSet = _a.setExpandedBlockIdsSet;
    var codeFoldMessageRenderer = renderProps.codeFoldMessageRenderer, hideLineNumbers = renderProps.hideLineNumbers, splitView = renderProps.splitView;
    var message = codeFoldMessageRenderer ? (codeFoldMessageRenderer(num, leftBlockLineNumber, rightBlockLineNumber)) : (React.createElement("pre", { className: renderProps.styles.codeFoldContent },
        "Expand ",
        num,
        " lines ..."));
    var content = (React.createElement("td", null,
        React.createElement("a", { onClick: function () {
                expandBlock(blockNumber, expandBlockIdsSet, function (newState) { return setExpandedBlockIdsSet(newState); });
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
function Title(_a) {
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
function DiffViewer(_a) {
    var _b;
    var _c = _a.oldValue, oldValue = _c === void 0 ? '' : _c, _d = _a.newValue, newValue = _d === void 0 ? '' : _d, _e = _a.splitView, splitView = _e === void 0 ? true : _e, _f = _a.highlightLines, highlightLines = _f === void 0 ? [] : _f, _g = _a.disableWordDiff, disableWordDiff = _g === void 0 ? false : _g, _h = _a.compareMethod, compareMethod = _h === void 0 ? compute_lines_1.DiffMethod.CHARS : _h, _j = _a.styles, styleOverrides = _j === void 0 ? {} : _j, _k = _a.hideLineNumbers, hideLineNumbers = _k === void 0 ? false : _k, _l = _a.extraLinesSurroundingDiff, extraLinesSurroundingDiff = _l === void 0 ? 3 : _l, _m = _a.showDiffOnly, showDiffOnly = _m === void 0 ? true : _m, _o = _a.useDarkTheme, useDarkTheme = _o === void 0 ? false : _o, _p = _a.linesOffset, linesOffset = _p === void 0 ? 0 : _p, rest = __rest(_a, ["oldValue", "newValue", "splitView", "highlightLines", "disableWordDiff", "compareMethod", "styles", "hideLineNumbers", "extraLinesSurroundingDiff", "showDiffOnly", "useDarkTheme", "linesOffset"]);
    var _q = __read(React.useState(new Set()), 2), expandedBlockIdsSet = _q[0], setExpandedBlockIdsSet = _q[1];
    var startTime = performance.now();
    // const {
    // 	oldValue,
    // 	newValue,
    // 	useDarkTheme,
    // 		splitView,
    // 		renderNodeWrapper,
    // 	} = props;
    var props = __assign({ oldValue: oldValue, newValue: newValue, splitView: splitView, highlightLines: highlightLines, disableWordDiff: disableWordDiff, compareMethod: compareMethod, styles: styleOverrides, hideLineNumbers: hideLineNumbers, extraLinesSurroundingDiff: extraLinesSurroundingDiff, showDiffOnly: showDiffOnly, useDarkTheme: useDarkTheme, linesOffset: linesOffset }, rest);
    if (typeof oldValue !== 'string' || typeof newValue !== 'string') {
        throw Error('"oldValue" and "newValue" should be strings');
    }
    var styles = React.useMemo(function () { return (0, styles_1.default)(props.styles, useDarkTheme); }, [props.styles, useDarkTheme]);
    var renderProps = React.useMemo(function () { return (__assign(__assign({}, props), { styles: styles })); }, [props, styles]);
    var linesToRender = React.useMemo(function () { return (0, getLinesToRender_1.default)(renderProps, expandedBlockIdsSet).slice(0, 100); }, [renderProps, expandedBlockIdsSet]);
    return (React.createElement("table", { className: (0, classnames_1.default)(styles.diffContainer, (_b = {},
            _b[styles.splitView] = splitView,
            _b)) },
        React.createElement("tbody", null,
            React.createElement(Title, __assign({}, renderProps)),
            linesToRender.slice(0, 100).map(function (line, i) {
                var node;
                if (typeof line === 'object' && 'num' in line) {
                    node = (React.createElement(RenderSkippedLineIndicator, __assign({}, line, { renderProps: renderProps, expandBlockIdsSet: expandedBlockIdsSet, setExpandedBlockIdsSet: setExpandedBlockIdsSet })));
                }
                else {
                    var _a = line, lineIndex = _a.index, lineProps = __rest(_a, ["index"]);
                    // const lineInfo = line as LineInformationProps;
                    node = splitView ? (React.createElement(RenderSplitView, { lineInfo: lineProps, renderProps: renderProps, index: lineIndex })) : (React.createElement(RenderInlineView, { lineInfo: lineProps, renderProps: renderProps, index: lineIndex }));
                }
                return (React.createElement(RenderNode, { key: i, index: i, renderNodeWrapper: props.renderNodeWrapper }, node));
            }))));
}
// class DiffViewer extends React.Component<
// 	ReactDiffViewerProps,
// 	ReactDiffViewerState
// > {
// 	// private styles: ReactDiffViewerStyles;
// 	public static defaultProps: ReactDiffViewerProps = {
// 		oldValue: '',
// 		newValue: '',
// 		splitView: true,
// 		highlightLines: [],
// 		disableWordDiff: false,
// 		compareMethod: DiffMethod.CHARS,
// 		styles: {},
// 		hideLineNumbers: false,
// 		extraLinesSurroundingDiff: 3,
// 		showDiffOnly: true,
// 		useDarkTheme: false,
// 		linesOffset: 0,
// 	};
// 	public static propTypes = {
// 		oldValue: PropTypes.string.isRequired,
// 		newValue: PropTypes.string.isRequired,
// 		splitView: PropTypes.bool,
// 		disableWordDiff: PropTypes.bool,
// 		compareMethod: PropTypes.oneOf(Object.values(DiffMethod)),
// 		renderContent: PropTypes.func,
// 		onLineNumberClick: PropTypes.func,
// 		extraLinesSurroundingDiff: PropTypes.number,
// 		styles: PropTypes.object,
// 		hideLineNumbers: PropTypes.bool,
// 		showDiffOnly: PropTypes.bool,
// 		highlightLines: PropTypes.arrayOf(PropTypes.string),
// 		leftTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
// 		rightTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
// 		linesOffset: PropTypes.number,
// 	};
// 	public constructor(props: ReactDiffViewerProps) {
// 		super(props);
// 		this.state = {
// 			expandedBlocks: new Set<number>(),
// 		};
// 	}
// 	/**
// 	 * Resets code block expand to the initial stage. Will be exposed to the parent component via
// 	 * refs.
// 	 */
// 	// public resetCodeBlocks = (): boolean => {
// 	// 	if (this.state.expandedBlocks.size > 0) {
// 	// 		this.setState({
// 	// 			expandedBlocks: new Set<number>(),
// 	// 		});
// 	// 		return true;
// 	// 	}
// 	// 	return false;
// 	// };
// 	/**
// 	 * Pushes the target expanded code block to the state. During the re-render,
// 	 * this value is used to expand/fold unmodified code.
// 	 */
// 	// private onBlockExpand = (id: number): void => {
// 	// 	const newState = this.state.expandedBlocks.add(id)
// 	// 	this.setState({
// 	// 		expandedBlocks: newState,
// 	// 	});
// 	// };
// 	/**
// 	 * Computes final styles for the diff viewer. It combines the default styles with the user
// 	 * supplied overrides. The computed styles are cached with performance in mind.
// 	 *
// 	 * @param styles User supplied style overrides.
// 	 */
// 	// private computeStyles: (
// 	// 	styles: ReactDiffViewerStylesOverride,
// 	// 	useDarkTheme: boolean,
// 	// ) => ReactDiffViewerStyles = memoize(computeStyles);
// 	/**
// 	 * Returns a function with clicked line number in the closure. Returns an no-op function when no
// 	 * onLineNumberClick handler is supplied.
// 	 *
// 	 * @param id Line id of a line.
// 	 */
// 	// private onLineNumberClickProxy = (id: string): any => {
// 	// 	if (this.props.onLineNumberClick) {
// 	// 		return (e: any): void => this.props.onLineNumberClick(id, e);
// 	// 	}
// 	// 	return (): void => {};
// 	// };
// 	/**
// 	 * Maps over the word diff and constructs the required React elements to show word diff.
// 	 *
// 	 * @param diffArray Word diff information derived from line information.
// 	 * @param renderer Optional renderer to format diff words. Useful for syntax highlighting.
// 	 */
// 	// private renderWordDiff = (
// 	// 	diffArray: DiffInformation[],
// 	// 	renderer?: (chunk: string) => React.ReactElement,
// 	// ): React.ReactElement[] => {
// 	// 	return diffArray.map(
// 	// 		(wordDiff, i): React.ReactElement => {
// 	// 			return (
// 	// 				<span
// 	// 					key={i}
// 	// 					className={cn(this.styles.wordDiff, {
// 	// 						[this.styles.wordAdded]: wordDiff.type === DiffType.ADDED,
// 	// 						[this.styles.wordRemoved]: wordDiff.type === DiffType.REMOVED,
// 	// 					})}>
// 	// 					{renderer ? renderer(wordDiff.value as string) : wordDiff.value as string}
// 	// 				</span>
// 	// 			);
// 	// 		},
// 	// 	);
// 	// };
// 	/**
// 	 * Maps over the line diff and constructs the required react elements to show line diff.
// 	 * It calls renderWordDiff when encountering word diff. This takes care of both inline
// 	 * and split view line renders.
// 	 *
// 	 * @param lineNumber Line number of the current line.
// 	 * @param type Type of diff of the current line.
// 	 * @param prefix Unique id to prefix with the line numbers.
// 	 * @param value Content of the line. It can be a string or a word diff array.
// 	 * @param additionalLineNumber Additional line number to be shown. Useful for rendering inline
// 	 *  diff view. Right line number will be passed as additionalLineNumber.
// 	 * @param additionalPrefix Similar to prefix but for additional line number.
// 	 */
// 	// private renderLine = (
// 	// 	lineNumber: number,
// 	// 	type: DiffType,
// 	// 	prefix: LineNumberPrefix,
// 	// 	value: string | DiffInformation[],
// 	// 	styles: ReactDiffViewerStyles,
// 	// 	additionalLineNumber?: number,
// 	// 	additionalPrefix?: LineNumberPrefix,
// 	// ): React.ReactElement => {
// 	// 	const lineNumberTemplate = `${prefix}-${lineNumber}`;
// 	// 	const additionalLineNumberTemplate = `${additionalPrefix}-${additionalLineNumber}`;
// 	// 	const highlightLine =
// 	// 		this.props.highlightLines.includes(lineNumberTemplate) ||
// 	// 		this.props.highlightLines.includes(additionalLineNumberTemplate);
// 	// 	const added = type === DiffType.ADDED;
// 	// 	const removed = type === DiffType.REMOVED;
// 	// 	let content;
// 	// 	if (Array.isArray(value)) {
// 	// 		content = (
// 	// 			<WordDiff
// 	// 				diffArray={value}
// 	// 				renderer={this.props.renderContent}
// 	// 				styles={styles}
// 	// 			/>
// 	// 		);
// 	// 	} else if (this.props.renderContent) {
// 	// 		content = this.props.renderContent(value);
// 	// 	} else {
// 	// 		content = value;
// 	// 	}
// 	// 	function onLineNumberClickProxy(id: string) {
// 	// 		if (this.props.onLineNumberClick) {
// 	// 			return (e: any): void => this.props.onLineNumberClick(id, e);
// 	// 		}
// 	// 		return (): void => {};
// 	// 	};
// 	// 	return (
// 	// 		<React.Fragment>
// 	// 			{!this.props.hideLineNumbers && (
// 	// 				<td
// 	// 					onClick={
// 	// 						lineNumber && onLineNumberClickProxy(lineNumberTemplate)
// 	// 					}
// 	// 					className={cn(styles.gutter, {
// 	// 						[styles.emptyGutter]: !lineNumber,
// 	// 						[styles.diffAdded]: added,
// 	// 						[styles.diffRemoved]: removed,
// 	// 						[styles.highlightedGutter]: highlightLine,
// 	// 					})}>
// 	// 					<pre className={styles.lineNumber}>{lineNumber}</pre>
// 	// 				</td>
// 	// 			)}
// 	// 			{!this.props.splitView && !this.props.hideLineNumbers && (
// 	// 				<td
// 	// 					onClick={
// 	// 						additionalLineNumber &&
// 	// 						onLineNumberClickProxy(additionalLineNumberTemplate)
// 	// 					}
// 	// 					className={cn(styles.gutter, {
// 	// 						[styles.emptyGutter]: !additionalLineNumber,
// 	// 						[styles.diffAdded]: added,
// 	// 						[styles.diffRemoved]: removed,
// 	// 						[styles.highlightedGutter]: highlightLine,
// 	// 					})}>
// 	// 					<pre className={styles.lineNumber}>{additionalLineNumber}</pre>
// 	// 				</td>
// 	// 			)}
// 	// 			<td
// 	// 				className={cn(styles.marker, {
// 	// 					[styles.emptyLine]: !content,
// 	// 					[styles.diffAdded]: added,
// 	// 					[styles.diffRemoved]: removed,
// 	// 					[styles.highlightedLine]: highlightLine,
// 	// 				})}>
// 	// 				<pre>
// 	// 					{added && '+'}
// 	// 					{removed && '-'}
// 	// 				</pre>
// 	// 			</td>
// 	// 			<td
// 	// 				className={cn(styles.content, {
// 	// 					[styles.emptyLine]: !content,
// 	// 					[styles.diffAdded]: added,
// 	// 					[styles.diffRemoved]: removed,
// 	// 					[styles.highlightedLine]: highlightLine,
// 	// 				})}>
// 	// 				<pre className={styles.contentText}>{content}</pre>
// 	// 			</td>
// 	// 		</React.Fragment>
// 	// 	);
// 	// };
// 	/**
// 	 * Generates lines for split view.
// 	 *
// 	 * @param obj Line diff information.
// 	 * @param obj.left Life diff information for the left pane of the split view.
// 	 * @param obj.right Life diff information for the right pane of the split view.
// 	 * @param index React key for the lines.
// 	 */
// 	// private renderSplitView = (
// 	// 	{ left, right }: LineInformation,
// 	// 	renderProps: ReactDiffViewerRenderProps,
// 	// 	index: number,
// 	// ): React.ReactElement => {
// 	// 	return (
// 	// 		<tr key={index} className={renderProps.styles.line}>
// 	// 			<RenderLine
// 	// 				lineNumber={left.lineNumber}
// 	// 				type={left.type}
// 	// 				prefix={LineNumberPrefix.LEFT}
// 	// 				value={left.value}
// 	// 				renderProps={renderProps}
// 	// 			/>
// 	// 			<RenderLine
// 	// 				lineNumber={right.lineNumber}
// 	// 				type={right.type}
// 	// 				prefix={LineNumberPrefix.RIGHT}
// 	// 				value={right.value}
// 	// 				renderProps={renderProps}
// 	// 			/>
// 	// 		</tr>
// 	// 	);
// 	// };
// 	/**
// 	 * Generates lines for inline view.
// 	 *
// 	 * @param obj Line diff information.
// 	 * @param obj.left Life diff information for the added section of the inline view.
// 	 * @param obj.right Life diff information for the removed section of the inline view.
// 	 * @param index React key for the lines.
// 	 */
// 	// public renderInlineView = (
// 	// 	{ left, right }: LineInformation,
// 	// 	renderProps: ReactDiffViewerRenderProps,
// 	// 	index: number,
// 	// ): React.ReactElement => {
// 	// 	let content;
// 	// 	if (left.type === DiffType.REMOVED && right.type === DiffType.ADDED) {
// 	// 		return (
// 	// 			<React.Fragment key={index}>
// 	// 				<tr className={renderProps.styles.line}>
// 	// 					<RenderLine
// 	// 						lineNumber={left.lineNumber}
// 	// 						type={left.type}
// 	// 						prefix={LineNumberPrefix.LEFT}
// 	// 						value={left.value}
// 	// 						renderProps={renderProps}
// 	// 					/>
// 	// 				</tr>
// 	// 				<tr className={renderProps.styles.line}>
// 	// 					<RenderLine
// 	// 						lineNumber={null}
// 	// 						type={right.type}
// 	// 						prefix={LineNumberPrefix.RIGHT}
// 	// 						value={right.value}
// 	// 						renderProps={renderProps}
// 	// 					/>
// 	// 				</tr>
// 	// 			</React.Fragment>
// 	// 		);
// 	// 	}
// 	// 	if (left.type === DiffType.REMOVED) {
// 	// 		content = (
// 	// 			<RenderLine
// 	// 				lineNumber={left.lineNumber}
// 	// 				type={left.type}
// 	// 				prefix={LineNumberPrefix.LEFT}
// 	// 				value={left.value}
// 	// 				renderProps={renderProps}
// 	// 				additionalLineNumber={null}
// 	// 			/>
// 	// 		);
// 	// 		// this.renderLine(
// 	// 		// 	left.lineNumber,
// 	// 		// 	left.type,
// 	// 		// 	LineNumberPrefix.LEFT,
// 	// 		// 	left.value,
// 	// 		// 	styles,
// 	// 		// 	null,
// 	// 		// );
// 	// 	}
// 	// 	if (left.type === DiffType.DEFAULT) {
// 	// 		content = (
// 	// 			<RenderLine
// 	// 				lineNumber={left.lineNumber}
// 	// 				type={left.type}
// 	// 				prefix={LineNumberPrefix.LEFT}
// 	// 				value={left.value}
// 	// 				renderProps={renderProps}
// 	// 				additionalLineNumber={right.lineNumber}
// 	// 				additionalPrefix={LineNumberPrefix.RIGHT}
// 	// 			/>
// 	// 		);
// 	// 		// this.renderLine(
// 	// 		// 	left.lineNumber,
// 	// 		// 	left.type,
// 	// 		// 	LineNumberPrefix.LEFT,
// 	// 		// 	left.value,
// 	// 		// 	styles,
// 	// 		// 	right.lineNumber,
// 	// 		// 	LineNumberPrefix.RIGHT,
// 	// 		// );
// 	// 	}
// 	// 	if (right.type === DiffType.ADDED) {
// 	// 		content = (
// 	// 			<RenderLine
// 	// 				lineNumber={null}
// 	// 				type={right.type}
// 	// 				prefix={LineNumberPrefix.RIGHT}
// 	// 				value={right.value}
// 	// 				renderProps={renderProps}
// 	// 				additionalLineNumber={right.lineNumber}
// 	// 			/>
// 	// 		);
// 	// 		// content = this.renderLine(
// 	// 		// 	null,
// 	// 		// 	right.type,
// 	// 		// 	LineNumberPrefix.RIGHT,
// 	// 		// 	right.value,
// 	// 		// 	styles,
// 	// 		// 	right.lineNumber,
// 	// 		// );
// 	// 	}
// 	// 	return (
// 	// 		<tr key={index} className={renderProps.styles.line}>
// 	// 			{content}
// 	// 		</tr>
// 	// 	);
// 	// };
// 	/**
// 	 * Returns a function with clicked block number in the closure.
// 	 *
// 	 * @param id Cold fold block id.
// 	 */
// 	// private onBlockClickProxy = (id: number) => (): void =>
// 	// 	expandBlock(id, this.state.expandedBlocks, (newState: Set<number>) => this.setState({ expandedBlocks: newState }));
// 	/**
// 	 * Generates cold fold block. It also uses the custom message renderer when available to show
// 	 * cold fold messages.
// 	 *
// 	 * @param num Number of skipped lines between two blocks.
// 	 * @param blockNumber Code fold block id.
// 	 * @param leftBlockLineNumber First left line number after the current code fold block.
// 	 * @param rightBlockLineNumber First right line number after the current code fold block.
// 	 */
// 	// private renderSkippedLineIndicator = ({
// 	// 	num,
// 	// 	blockNumber,
// 	// 	leftBlockLineNumber,
// 	// 	rightBlockLineNumber,
// 	// 	renderProps,
// 	// }: {
// 	// 	num: number;
// 	// 	blockNumber: number;
// 	// 	leftBlockLineNumber: number;
// 	// 	rightBlockLineNumber: number;
// 	// 	renderProps: ReactDiffViewerRenderProps;
// 	// }): React.ReactElement => {
// 	// 	const { codeFoldMessageRenderer, hideLineNumbers, splitView } = renderProps;
// 	// 	const message = codeFoldMessageRenderer ? (
// 	// 		codeFoldMessageRenderer(
// 	// 			num,
// 	// 			leftBlockLineNumber,
// 	// 			rightBlockLineNumber,
// 	// 		)
// 	// 	) : (
// 	// 		<pre className={renderProps.styles.codeFoldContent}>Expand {num} lines ...</pre>
// 	// 	);
// 	// 	const content = (
// 	// 		<td>
// 	// 			<a
// 	// 				onClick={() => {
// 	// 					expandBlock(
// 	// 						blockNumber,
// 	// 						this.state.expandedBlocks,
// 	// 						(newState: Set<number>) => this.setState({ expandedBlocks: newState })
// 	// 					);
// 	// 				}}
// 	// 				tabIndex={0}>
// 	// 				{message}
// 	// 			</a>
// 	// 		</td>
// 	// 	);
// 	// 	const isUnifiedViewWithoutLineNumbers = !splitView && !hideLineNumbers;
// 	// 	return (
// 	// 		<tr
// 	// 			key={`${leftBlockLineNumber}-${rightBlockLineNumber}`}
// 	// 			className={renderProps.styles.codeFold}>
// 	// 			{!hideLineNumbers && <td className={renderProps.styles.codeFoldGutter} />}
// 	// 			<td
// 	// 				className={cn({
// 	// 					[renderProps.styles.codeFoldGutter]: isUnifiedViewWithoutLineNumbers,
// 	// 				})}
// 	// 			/>
// 	// 			{/* Swap columns only for unified view without line numbers */}
// 	// 			{isUnifiedViewWithoutLineNumbers ? (
// 	// 				<React.Fragment>
// 	// 					<td />
// 	// 					{content}
// 	// 				</React.Fragment>
// 	// 			) : (
// 	// 				<React.Fragment>
// 	// 					{content}
// 	// 					<td />
// 	// 				</React.Fragment>
// 	// 			)}
// 	// 			<td />
// 	// 			<td />
// 	// 		</tr>
// 	// 	);
// 	// };
// 	// /**
// 	//  * Generates the entire diff view.
// 	//  */
// 	// private getLinesToRender = (): Array<SkippedLineProps | LineInformationProps> => {
// 	// 	const {
// 	// 		oldValue,
// 	// 		newValue,
// 	// 		// splitView,
// 	// 		disableWordDiff,
// 	// 		compareMethod,
// 	// 		linesOffset,
// 	// 	} = this.props;
// 	// 	const { lineInformation, diffLines } = computeLineInformation(
// 	// 		oldValue,
// 	// 		newValue,
// 	// 		disableWordDiff,
// 	// 		compareMethod,
// 	// 		linesOffset,
// 	// 	);
// 	// 	const extraLines = this.props.extraLinesSurroundingDiff < 0
// 	// 			? 0
// 	// 			: this.props.extraLinesSurroundingDiff;
// 	// 	let skippedLines: number[] = [];
// 	// 	let diffLinesIndex = 0;
// 	// 	const lines: Array<SkippedLineProps | LineInformationProps> = []
// 	// 	lineInformation.forEach(
// 	// 		(line: LineInformation, i: number): React.ReactElement => {
// 	// 			const diffBlockStart = diffLines[diffLinesIndex];
// 	// 			const currentPosition = diffBlockStart - i;
// 	// 			if (this.props.showDiffOnly) {
// 	// 				if (currentPosition === -extraLines) {
// 	// 					skippedLines = [];
// 	// 					diffLinesIndex = diffLinesIndex + 1
// 	// 				}
// 	// 				if (
// 	// 					line.left.type === DiffType.DEFAULT &&
// 	// 					(currentPosition > extraLines ||
// 	// 						typeof diffBlockStart === 'undefined') &&
// 	// 					!this.state.expandedBlocks.has(diffBlockStart)
// 	// 				) {
// 	// 					skippedLines.push(i + 1);
// 	// 					if (i === lineInformation.length - 1 && skippedLines.length > 1) {
// 	// 						lines.push(
// 	// 							{
// 	// 								num: skippedLines.length,
// 	// 								blockNumber: diffBlockStart,
// 	// 								leftBlockLineNumber: line.left.lineNumber,
// 	// 								rightBlockLineNumber: line.right.lineNumber,
// 	// 							}
// 	// 						);
// 	// 						return
// 	// 					}
// 	// 					return null;
// 	// 				}
// 	// 			}
// 	// 			if (currentPosition === extraLines && skippedLines.length > 0) {
// 	// 				const { length } = skippedLines;
// 	// 				skippedLines = [];
// 	// 				lines.push(
// 	// 					{
// 	// 						num: length,
// 	// 						blockNumber: diffBlockStart,
// 	// 						leftBlockLineNumber: line.left.lineNumber,
// 	// 						rightBlockLineNumber: line.right.lineNumber,
// 	// 					}
// 	// 				);
// 	// 				return
// 	// 			}
// 	// 			lines.push({
// 	// 				...line,
// 	// 				index: i,
// 	// 			});
// 	// 			return
// 	// 		},
// 	// 	);
// 	// 	return lines
// 	// };
// 	public render = (): React.ReactElement => {
// 		const startTime = performance.now();
// 		const {
// 			oldValue,
// 			newValue,
// 			useDarkTheme,
// 			leftTitle,
// 			rightTitle,
// 			splitView,
// 			hideLineNumbers,
// 			renderNodeWrapper
// 		} = this.props;
// 		if (typeof oldValue !== 'string' || typeof newValue !== 'string') {
// 			throw Error('"oldValue" and "newValue" should be strings');
// 		}
// 		const styles = computeStyles(this.props.styles, useDarkTheme);
// 		const linesToRender = getLinesToRender({
// 				...this.props,
// 				styles,
// 			}).slice(0,100)
// 		const renderProps: ReactDiffViewerRenderProps = {
// 			...this.props,
// 			styles
// 		}
// 		// this.getLinesToRender().slice(0, 100);
// 		const colSpanOnSplitView = hideLineNumbers ? 2 : 3;
// 		const colSpanOnInlineView = hideLineNumbers ? 2 : 4;
// 		const title = (leftTitle || rightTitle) && (
// 			<tr>
// 				<td
// 					colSpan={splitView ? colSpanOnSplitView : colSpanOnInlineView}
// 					className={styles.titleBlock}>
// 					<pre className={styles.contentText}>{leftTitle}</pre>
// 				</td>
// 				{splitView && (
// 					<td colSpan={colSpanOnSplitView} className={styles.titleBlock}>
// 						<pre className={styles.contentText}>{rightTitle}</pre>
// 					</td>
// 				)}
// 			</tr>
// 		);
// // console.log({linesToRender})
// 		const preRender = performance.now()
// 		console.log('ready to render', preRender - startTime, 'ms');
// 		return (
// 			<table
// 				className={cn(styles.diffContainer, {
// 					[styles.splitView]: splitView,
// 				})}>
// 				<tbody>
// 					{title}
// 					{linesToRender.slice(0,100).map((line, i) => {
// 						let node: React.ReactElement
// 						if (typeof line === 'object' && 'num' in line) {
// 							node = <RenderSkippedLineIndicator {...line} renderProps={renderProps} />;
// 						} else {
// 							const { index: lineIndex, ...lineProps } = line as LineInformationProps;
// 							// const lineInfo = line as LineInformationProps;
// 							node = splitView
// 							? (
// 								<RenderSplitView
// 									lineInfo={lineProps}
// 									renderProps={renderProps}
// 									index={lineIndex}
// 								/>
// 							) : <RenderInlineView lineInfo={lineProps} renderProps={renderProps} index={lineIndex} />;
// 						}
// 						return (
// 							<RenderNode
// 								key={i}
// 								index={i}
// 								renderNodeWrapper={renderNodeWrapper}>
// 								{node}
// 							</RenderNode>
// 						);
// 					})}
// 					{/* {renderNodeWrapper ? nodes.map((node, index) => renderNodeWrapper(node, index)) : nodes}					 */}
// 				</tbody>
// 			</table>
// 		);
// 	};
// }
exports.default = DiffViewer;

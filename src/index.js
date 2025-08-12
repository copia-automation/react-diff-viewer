const __extends = (this && this.__extends)
  || (function () {
    let extendStatics = function (d, b) {
      extendStatics = Object.setPrototypeOf
        || ({ __proto__: [] } instanceof Array
          && function (d, b) {
            d.__proto__ = b;
          })
        || function (d, b) {
          for (const p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      if (typeof b !== 'function' && b !== null) {
 throw new TypeError(
          `Class extends value ${String(b)} is not a constructor or null`,
        );
}
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  }());
Object.defineProperty(exports, '__esModule', { value: true });
exports.DiffMethod = exports.LineNumberPrefix = void 0;
const React = require('react');
const PropTypes = require('prop-types');
const classnames_1 = require('classnames');
const compute_lines_1 = require('./compute-lines');

Object.defineProperty(exports, 'DiffMethod', {
  enumerable: true,
  get() {
    return compute_lines_1.DiffMethod;
  },
});
const styles_1 = require('./styles');

const m = require('memoize-one');

const memoize = m.default || m;
let LineNumberPrefix;
(function (LineNumberPrefix) {
  LineNumberPrefix.LEFT = 'L';
  LineNumberPrefix.RIGHT = 'R';
}(LineNumberPrefix || (exports.LineNumberPrefix = LineNumberPrefix = {})));
const DiffViewer = /** @class */ (function (_super) {
  __extends(DiffViewer, _super);
  function DiffViewer(props) {
    const _this = _super.call(this, props) || this;
    /**
     * Resets code block expand to the initial stage. Will be exposed to the parent component via
     * refs.
     */
    _this.resetCodeBlocks = function () {
      if (_this.state.expandedBlocks.length > 0) {
        _this.setState({
          expandedBlocks: [],
        });
        return true;
      }
      return false;
    };
    /**
     * Pushes the target expanded code block to the state. During the re-render,
     * this value is used to expand/fold unmodified code.
     */
    _this.onBlockExpand = function (id) {
      const prevState = _this.state.expandedBlocks.slice();
      prevState.push(id);
      _this.setState({
        expandedBlocks: prevState,
      });
    };
    /**
     * Computes final styles for the diff viewer. It combines the default styles with the user
     * supplied overrides. The computed styles are cached with performance in mind.
     *
     * @param styles User supplied style overrides.
     */
    _this.computeStyles = memoize(styles_1.default);
    /**
     * Returns a function with clicked line number in the closure. Returns an no-op function when no
     * onLineNumberClick handler is supplied.
     *
     * @param id Line id of a line.
     */
    _this.onLineNumberClickProxy = function (id) {
      if (_this.props.onLineNumberClick) {
        return function (e) {
          return _this.props.onLineNumberClick(id, e);
        };
      }
      return function () {};
    };
    /**
     * Maps over the word diff and constructs the required React elements to show word diff.
     *
     * @param diffArray Word diff information derived from line information.
     * @param renderer Optional renderer to format diff words. Useful for syntax highlighting.
     */
    _this.renderWordDiff = function (diffArray, renderer) {
      return diffArray.map((wordDiff, i) => {
        let _a;
        return React.createElement(
          'span',
          {
            key: i,
            className: (0, classnames_1.default)(
              _this.styles.wordDiff,
              ((_a = {}),
              (_a[_this.styles.wordAdded] = wordDiff.type === compute_lines_1.DiffType.ADDED),
              (_a[_this.styles.wordRemoved] = wordDiff.type === compute_lines_1.DiffType.REMOVED),
              _a),
            ),
          },
          renderer ? renderer(wordDiff.value) : wordDiff.value,
        );
      });
    };
    /**
     * Maps over the line diff and constructs the required react elements to show line diff. It calls
     * renderWordDiff when encountering word diff. This takes care of both inline and split view line
     * renders.
     *
     * @param lineNumber Line number of the current line.
     * @param type Type of diff of the current line.
     * @param prefix Unique id to prefix with the line numbers.
     * @param value Content of the line. It can be a string or a word diff array.
     * @param additionalLineNumber Additional line number to be shown. Useful for rendering inline
     *  diff view. Right line number will be passed as additionalLineNumber.
     * @param additionalPrefix Similar to prefix but for additional line number.
     */
    _this.renderLine = function (
      lineNumber,
      type,
      prefix,
      value,
      additionalLineNumber,
      additionalPrefix,
    ) {
      let _a; let _b; let _c; let
_d;
      const lineNumberTemplate = ''.concat(prefix, '-').concat(lineNumber);
      const additionalLineNumberTemplate = ''
        .concat(additionalPrefix, '-')
        .concat(additionalLineNumber);
      const highlightLine = _this.props.highlightLines.includes(lineNumberTemplate)
        || _this.props.highlightLines.includes(additionalLineNumberTemplate);
      const added = type === compute_lines_1.DiffType.ADDED;
      const removed = type === compute_lines_1.DiffType.REMOVED;
      let content;
      if (Array.isArray(value)) {
        content = _this.renderWordDiff(value, _this.props.renderContent);
      } else if (_this.props.renderContent) {
        content = _this.props.renderContent(value);
      } else {
        content = value;
      }
      return React.createElement(
        React.Fragment,
        null,
        !_this.props.hideLineNumbers
          && React.createElement(
            'td',
            {
              onClick:
                lineNumber && _this.onLineNumberClickProxy(lineNumberTemplate),
              className: (0, classnames_1.default)(
                _this.styles.gutter,
                ((_a = {}),
                (_a[_this.styles.emptyGutter] = !lineNumber),
                (_a[_this.styles.diffAdded] = added),
                (_a[_this.styles.diffRemoved] = removed),
                (_a[_this.styles.highlightedGutter] = highlightLine),
                _a),
              ),
            },
            React.createElement(
              'pre',
              { className: _this.styles.lineNumber },
              lineNumber,
            ),
          ),
        !_this.props.splitView
          && !_this.props.hideLineNumbers
          && React.createElement(
            'td',
            {
              onClick:
                additionalLineNumber
                && _this.onLineNumberClickProxy(additionalLineNumberTemplate),
              className: (0, classnames_1.default)(
                _this.styles.gutter,
                ((_b = {}),
                (_b[_this.styles.emptyGutter] = !additionalLineNumber),
                (_b[_this.styles.diffAdded] = added),
                (_b[_this.styles.diffRemoved] = removed),
                (_b[_this.styles.highlightedGutter] = highlightLine),
                _b),
              ),
            },
            React.createElement(
              'pre',
              { className: _this.styles.lineNumber },
              additionalLineNumber,
            ),
          ),
        React.createElement(
          'td',
          {
            className: (0, classnames_1.default)(
              _this.styles.marker,
              ((_c = {}),
              (_c[_this.styles.emptyLine] = !content),
              (_c[_this.styles.diffAdded] = added),
              (_c[_this.styles.diffRemoved] = removed),
              (_c[_this.styles.highlightedLine] = highlightLine),
              _c),
            ),
          },
          React.createElement('pre', null, added && '+', removed && '-'),
        ),
        React.createElement(
          'td',
          {
            className: (0, classnames_1.default)(
              _this.styles.content,
              ((_d = {}),
              (_d[_this.styles.emptyLine] = !content),
              (_d[_this.styles.diffAdded] = added),
              (_d[_this.styles.diffRemoved] = removed),
              (_d[_this.styles.highlightedLine] = highlightLine),
              _d),
            ),
          },
          React.createElement(
            'pre',
            { className: _this.styles.contentText },
            content,
          ),
        ),
      );
    };
    /**
     * Generates lines for split view.
     *
     * @param obj Line diff information.
     * @param obj.left Life diff information for the left pane of the split view.
     * @param obj.right Life diff information for the right pane of the split view.
     * @param index React key for the lines.
     */
    _this.renderSplitView = function (_a, index) {
      const { left } = _a;
        const { right } = _a;
      return React.createElement(
        'tr',
        { key: index, className: _this.styles.line },
        _this.renderLine(
          left.lineNumber,
          left.type,
          LineNumberPrefix.LEFT,
          left.value,
        ),
        _this.renderLine(
          right.lineNumber,
          right.type,
          LineNumberPrefix.RIGHT,
          right.value,
        ),
      );
    };
    /**
     * Generates lines for inline view.
     *
     * @param obj Line diff information.
     * @param obj.left Life diff information for the added section of the inline view.
     * @param obj.right Life diff information for the removed section of the inline view.
     * @param index React key for the lines.
     */
    _this.renderInlineView = function (_a, index) {
      const { left } = _a;
        const { right } = _a;
      let content;
      if (
        left.type === compute_lines_1.DiffType.REMOVED
        && right.type === compute_lines_1.DiffType.ADDED
      ) {
        return React.createElement(
          React.Fragment,
          { key: index },
          React.createElement(
            'tr',
            { className: _this.styles.line },
            _this.renderLine(
              left.lineNumber,
              left.type,
              LineNumberPrefix.LEFT,
              left.value,
              null,
            ),
          ),
          React.createElement(
            'tr',
            { className: _this.styles.line },
            _this.renderLine(
              null,
              right.type,
              LineNumberPrefix.RIGHT,
              right.value,
              right.lineNumber,
            ),
          ),
        );
      }
      if (left.type === compute_lines_1.DiffType.REMOVED) {
        content = _this.renderLine(
          left.lineNumber,
          left.type,
          LineNumberPrefix.LEFT,
          left.value,
          null,
        );
      }
      if (left.type === compute_lines_1.DiffType.DEFAULT) {
        content = _this.renderLine(
          left.lineNumber,
          left.type,
          LineNumberPrefix.LEFT,
          left.value,
          right.lineNumber,
          LineNumberPrefix.RIGHT,
        );
      }
      if (right.type === compute_lines_1.DiffType.ADDED) {
        content = _this.renderLine(
          null,
          right.type,
          LineNumberPrefix.RIGHT,
          right.value,
          right.lineNumber,
        );
      }
      return React.createElement(
        'tr',
        { key: index, className: _this.styles.line },
        content,
      );
    };
    /**
     * Returns a function with clicked block number in the closure.
     *
     * @param id Cold fold block id.
     */
    _this.onBlockClickProxy = function (id) {
      return function () {
        return _this.onBlockExpand(id);
      };
    };
    /**
     * Generates cold fold block. It also uses the custom message renderer when available to show
     * cold fold messages.
     *
     * @param num Number of skipped lines between two blocks.
     * @param blockNumber Code fold block id.
     * @param leftBlockLineNumber First left line number after the current code fold block.
     * @param rightBlockLineNumber First right line number after the current code fold block.
     */
    _this.renderSkippedLineIndicator = function (
      num,
      blockNumber,
      leftBlockLineNumber,
      rightBlockLineNumber,
    ) {
      let _a;
      const _b = _this.props;
        const { hideLineNumbers } = _b;
        const { splitView } = _b;
      const message = _this.props.codeFoldMessageRenderer
        ? _this.props.codeFoldMessageRenderer(
            num,
            leftBlockLineNumber,
            rightBlockLineNumber,
          )
        : React.createElement(
            'pre',
            { className: _this.styles.codeFoldContent },
            'Expand ',
            num,
            ' lines ...',
          );
      const content = React.createElement(
        'td',
        null,
        React.createElement(
          'a',
          { onClick: _this.onBlockClickProxy(blockNumber), tabIndex: 0 },
          message,
        ),
      );
      const isUnifiedViewWithoutLineNumbers = !splitView && !hideLineNumbers;
      return React.createElement(
        'tr',
        {
          key: ''.concat(leftBlockLineNumber, '-').concat(rightBlockLineNumber),
          className: _this.styles.codeFold,
        },
        !hideLineNumbers
          && React.createElement('td', { className: _this.styles.codeFoldGutter }),
        React.createElement('td', {
          className: (0, classnames_1.default)(
            ((_a = {}),
            (_a[_this.styles.codeFoldGutter] = isUnifiedViewWithoutLineNumbers),
            _a),
          ),
        }),
        isUnifiedViewWithoutLineNumbers
          ? React.createElement(
              React.Fragment,
              null,
              React.createElement('td', null),
              content,
            )
          : React.createElement(
              React.Fragment,
              null,
              content,
              React.createElement('td', null),
            ),
        React.createElement('td', null),
        React.createElement('td', null),
      );
    };
    /**
     * Generates the entire diff view.
     */
    _this.renderDiff = function () {
      const _a = _this.props;
        const { oldValue } = _a;
        const { newValue } = _a;
        const { splitView } = _a;
        const { disableWordDiff } = _a;
        const { compareMethod } = _a;
        const { linesOffset } = _a;
      const _b = (0, compute_lines_1.computeLineInformation)(
          oldValue,
          newValue,
          disableWordDiff,
          compareMethod,
          linesOffset,
        );
        const { lineInformation } = _b;
        const { diffLines } = _b;
      const extraLines = _this.props.extraLinesSurroundingDiff < 0
          ? 0
          : _this.props.extraLinesSurroundingDiff;
      let skippedLines = [];
      return lineInformation.map((line, i) => {
        const diffBlockStart = diffLines[0];
        const currentPosition = diffBlockStart - i;
        if (_this.props.showDiffOnly) {
          if (currentPosition === -extraLines) {
            skippedLines = [];
            diffLines.shift();
          }
          if (
            line.left.type === compute_lines_1.DiffType.DEFAULT
            && (currentPosition > extraLines
              || typeof diffBlockStart === 'undefined')
            && !_this.state.expandedBlocks.includes(diffBlockStart)
          ) {
            skippedLines.push(i + 1);
            if (i === lineInformation.length - 1 && skippedLines.length > 1) {
              return _this.renderSkippedLineIndicator(
                skippedLines.length,
                diffBlockStart,
                line.left.lineNumber,
                line.right.lineNumber,
              );
            }
            return null;
          }
        }
        const diffNodes = splitView
          ? _this.renderSplitView(line, i)
          : _this.renderInlineView(line, i);
        if (currentPosition === extraLines && skippedLines.length > 0) {
          const length_1 = skippedLines.length;
          skippedLines = [];
          return React.createElement(
            React.Fragment,
            { key: i },
            _this.renderSkippedLineIndicator(
              length_1,
              diffBlockStart,
              line.left.lineNumber,
              line.right.lineNumber,
            ),
            diffNodes,
          );
        }
        return diffNodes;
      });
    };
    _this.render = function () {
      let _a;
      const _b = _this.props;
        const { oldValue } = _b;
        const { newValue } = _b;
        const { useDarkTheme } = _b;
        const { leftTitle } = _b;
        const { rightTitle } = _b;
        const { splitView } = _b;
        const { hideLineNumbers } = _b;
        const { renderNodeWrapper } = _b;
      if (typeof oldValue !== 'string' || typeof newValue !== 'string') {
        throw Error('"oldValue" and "newValue" should be strings');
      }
      _this.styles = _this.computeStyles(_this.props.styles, useDarkTheme);
      const nodes = _this.renderDiff();
      const colSpanOnSplitView = hideLineNumbers ? 2 : 3;
      const colSpanOnInlineView = hideLineNumbers ? 2 : 4;
      const title = (leftTitle || rightTitle)
        && React.createElement(
          'tr',
          null,
          React.createElement(
            'td',
            {
              colSpan: splitView ? colSpanOnSplitView : colSpanOnInlineView,
              className: _this.styles.titleBlock,
            },
            React.createElement(
              'pre',
              { className: _this.styles.contentText },
              leftTitle,
            ),
          ),
          splitView
            && React.createElement(
              'td',
              {
                colSpan: colSpanOnSplitView,
                className: _this.styles.titleBlock,
              },
              React.createElement(
                'pre',
                { className: _this.styles.contentText },
                rightTitle,
              ),
            ),
        );
      return React.createElement(
        'table',
        {
          className: (0, classnames_1.default)(
            _this.styles.diffContainer,
            ((_a = {}), (_a[_this.styles.splitView] = splitView), _a),
          ),
        },
        React.createElement(
          'tbody',
          null,
          title,
          renderNodeWrapper
            ? nodes.map((node, index) => {
                return renderNodeWrapper(node, index);
              })
            : nodes,
        ),
      );
    };
    _this.state = {
      expandedBlocks: [],
    };
    return _this;
  }
  DiffViewer.defaultProps = {
    oldValue: '',
    newValue: '',
    splitView: true,
    highlightLines: [],
    disableWordDiff: false,
    compareMethod: compute_lines_1.DiffMethod.CHARS,
    styles: {},
    hideLineNumbers: false,
    extraLinesSurroundingDiff: 3,
    showDiffOnly: true,
    useDarkTheme: false,
    linesOffset: 0,
  };
  DiffViewer.propTypes = {
    oldValue: PropTypes.string.isRequired,
    newValue: PropTypes.string.isRequired,
    splitView: PropTypes.bool,
    disableWordDiff: PropTypes.bool,
    compareMethod: PropTypes.oneOf(Object.values(compute_lines_1.DiffMethod)),
    renderContent: PropTypes.func,
    onLineNumberClick: PropTypes.func,
    extraLinesSurroundingDiff: PropTypes.number,
    styles: PropTypes.object,
    hideLineNumbers: PropTypes.bool,
    showDiffOnly: PropTypes.bool,
    highlightLines: PropTypes.arrayOf(PropTypes.string),
    leftTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    rightTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    linesOffset: PropTypes.number,
  };
  return DiffViewer;
}(React.Component));
exports.default = DiffViewer;

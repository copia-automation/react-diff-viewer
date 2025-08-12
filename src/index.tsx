import * as React from 'react';
import * as PropTypes from 'prop-types';
import cn from 'classnames';

import memoize from 'memoize-one';
import helpers from './helpers';

import {
  computeLineInformation,
  LineInformation,
  DiffInformation,
  DiffType,
  DiffMethod,
} from './compute-lines';
import computeStyles, {
  ReactDiffViewerStylesOverride,
  ReactDiffViewerStyles,
} from './styles';
import getLinesToRender, {
  SkippedLineProps,
  RenderSkippedLineProps,
  LineInformationProps,
  ReactDiffViewerRenderProps,
  LineNumberPrefix,
} from './getLinesToRender';
// import type { SkippedLineProps, }
const { expandBlock } = helpers;

// export enum LineNumberPrefix {
// 	LEFT = 'L',
// 	RIGHT = 'R',
// }

// type SkippedLineProps = {
// 	num: number,
// 	blockNumber: number,
// 	leftBlockLineNumber: number,
// 	rightBlockLineNumber: number,
// 	// styles: ReactDiffViewerStyles,
// }

// interface RenderSkippedLineProps extends SkippedLineProps {
// 	styles: ReactDiffViewerStyles,
// }
// interface LineInformationProps extends LineInformation {
// 	index: number;
// }
export interface ReactDiffViewerProps {
  // Old value to compare.
  oldValue: string;
  // New value to compare.
  newValue: string;
  // Enable/Disable split view.
  splitView?: boolean;
  // Set line Offset
  linesOffset?: number;
  // Enable/Disable word diff.
  disableWordDiff?: boolean;
  // JsDiff text diff method from https://github.com/kpdecker/jsdiff/tree/v4.0.1#api
  compareMethod?: DiffMethod;
  // Number of unmodified lines surrounding each line diff.
  extraLinesSurroundingDiff?: number;
  // Show/hide line number.
  hideLineNumbers?: boolean;
  // Show only diff between the two values.
  showDiffOnly?: boolean;
  // Render prop to format final string before displaying them in the UI.
  renderContent?: (source: string) => React.ReactElement;
  // Render prop to format code fold message.
  codeFoldMessageRenderer?: (
    totalFoldedLines: number,
    leftStartLineNumber: number,
    rightStartLineNumber: number,
  ) => React.ReactElement;
  // Event handler for line number click.
  onLineNumberClick?: (
    lineId: string,
    event: React.MouseEvent<HTMLTableCellElement>,
  ) => void;
  // Array of line ids to highlight lines.
  highlightLines?: string[];
  // Style overrides.
  styles?: ReactDiffViewerStylesOverride;
  // Use dark theme.
  useDarkTheme?: boolean;
  // Title for left column
  leftTitle?: string | React.ReactElement;
  // Title for left column
  rightTitle?: string | React.ReactElement;
  renderNodeWrapper?: (
    node: React.ReactElement,
    index: number,
  ) => React.ReactElement;
}

export interface ReactDiffViewerState {
  // Array holding the expanded code folding.
  expandedBlocks?: Set<number>;
}

// interface ReactDiffViewerRenderProps extends ReactDiffViewerProps {
// 	styles: ReactDiffViewerStyles;
// }

function WordDiff({
  diffArray,
  renderer,
  styles,
}: {
  diffArray: DiffInformation[];
  renderer?: (chunk: string) => React.ReactElement;
  styles: ReactDiffViewerStyles;
}) {
  // private renderWordDiff = (
  // 	diffArray: DiffInformation[],
  // 	renderer?: (chunk: string) => React.ReactElement,
  // ): React.ReactElement[] => {
  return diffArray.map((wordDiff, i): React.ReactElement => {
    return (
      <span
        key={i}
        className={cn(styles.wordDiff, {
          [styles.wordAdded]: wordDiff.type === DiffType.ADDED,
          [styles.wordRemoved]: wordDiff.type === DiffType.REMOVED,
        })}
      >
        {renderer
          ? renderer(wordDiff.value as string)
          : (wordDiff.value as string)}
      </span>
    );
  });
}

function RenderLine({
  lineNumber,
  type,
  prefix,
  value,
  additionalLineNumber,
  additionalPrefix,
  renderProps,
}: {
  lineNumber: number;
  type: DiffType;
  prefix: LineNumberPrefix;
  value: string | DiffInformation[];
  additionalLineNumber?: number;
  additionalPrefix?: LineNumberPrefix;
  renderProps: ReactDiffViewerRenderProps;
}) {
  const lineNumberTemplate = `${prefix}-${lineNumber}`;
  const additionalLineNumberTemplate = `${additionalPrefix}-${additionalLineNumber}`;
  const highlightLine = renderProps.highlightLines.includes(lineNumberTemplate)
    || renderProps.highlightLines.includes(additionalLineNumberTemplate);
  const added = type === DiffType.ADDED;
  const removed = type === DiffType.REMOVED;
  let content;
  if (Array.isArray(value)) {
    content = (
      <WordDiff
        diffArray={value}
        renderer={renderProps.renderContent}
        styles={renderProps.styles}
      />
    );
  } else if (renderProps.renderContent) {
    content = renderProps.renderContent(value);
  } else {
    content = value;
  }

  function onLineNumberClickProxy(id: string) {
    if (renderProps.onLineNumberClick) {
      return (e: any): void => renderProps.onLineNumberClick(id, e);
    }
    return (): void => {};
  }

  return (
    <React.Fragment>
      {!renderProps.hideLineNumbers && (
        <td
          onClick={lineNumber && onLineNumberClickProxy(lineNumberTemplate)}
          className={cn(renderProps.styles.gutter, {
            [renderProps.styles.emptyGutter]: !lineNumber,
            [renderProps.styles.diffAdded]: added,
            [renderProps.styles.diffRemoved]: removed,
            [renderProps.styles.highlightedGutter]: highlightLine,
          })}
        >
          <pre className={renderProps.styles.lineNumber}>{lineNumber}</pre>
        </td>
      )}
      {!renderProps.splitView && !renderProps.hideLineNumbers && (
        <td
          onClick={
            additionalLineNumber
            && onLineNumberClickProxy(additionalLineNumberTemplate)
          }
          className={cn(renderProps.styles.gutter, {
            [renderProps.styles.emptyGutter]: !additionalLineNumber,
            [renderProps.styles.diffAdded]: added,
            [renderProps.styles.diffRemoved]: removed,
            [renderProps.styles.highlightedGutter]: highlightLine,
          })}
        >
          <pre className={renderProps.styles.lineNumber}>
            {additionalLineNumber}
          </pre>
        </td>
      )}
      <td
        className={cn(renderProps.styles.marker, {
          [renderProps.styles.emptyLine]: !content,
          [renderProps.styles.diffAdded]: added,
          [renderProps.styles.diffRemoved]: removed,
          [renderProps.styles.highlightedLine]: highlightLine,
        })}
      >
        <pre>
          {added && '+'}
          {removed && '-'}
        </pre>
      </td>
      <td
        className={cn(renderProps.styles.content, {
          [renderProps.styles.emptyLine]: !content,
          [renderProps.styles.diffAdded]: added,
          [renderProps.styles.diffRemoved]: removed,
          [renderProps.styles.highlightedLine]: highlightLine,
        })}
      >
        <pre className={renderProps.styles.contentText}>{content}</pre>
      </td>
    </React.Fragment>
  );
}

function RenderSplitView({
  lineInfo: { left, right },
  renderProps,
  index,
}: {
  lineInfo: LineInformation;
  renderProps: ReactDiffViewerRenderProps;
  index: number;
}) {
  return (
    <tr key={index} className={renderProps.styles.line}>
      <RenderLine
        lineNumber={left.lineNumber}
        type={left.type}
        prefix={LineNumberPrefix.LEFT}
        value={left.value}
        renderProps={renderProps}
      />
      <RenderLine
        lineNumber={right.lineNumber}
        type={right.type}
        prefix={LineNumberPrefix.RIGHT}
        value={right.value}
        renderProps={renderProps}
      />
    </tr>
  );
}

function RenderNode({
  renderNodeWrapper,
  index,
  children,
}: {
  renderNodeWrapper?: (
    node: React.ReactElement,
    index: number,
  ) => React.ReactElement;
  children: React.ReactElement;
  index: number;
}): React.ReactElement {
  if (renderNodeWrapper) {
    return <>{renderNodeWrapper(children, index)}</>;
  }
  return <>{children}</>;
}

function RenderInlineView({
  lineInfo: { left, right },
  renderProps,
  index,
}: {
  lineInfo: LineInformation;
  renderProps: ReactDiffViewerRenderProps;
  index: number;
}) {
  let content;
  if (left.type === DiffType.REMOVED && right.type === DiffType.ADDED) {
    return (
      <React.Fragment key={index}>
        <tr className={renderProps.styles.line}>
          <RenderLine
            lineNumber={left.lineNumber}
            type={left.type}
            prefix={LineNumberPrefix.LEFT}
            value={left.value}
            renderProps={renderProps}
          />
        </tr>
        <tr className={renderProps.styles.line}>
          <RenderLine
            lineNumber={null}
            type={right.type}
            prefix={LineNumberPrefix.RIGHT}
            value={right.value}
            renderProps={renderProps}
          />
        </tr>
      </React.Fragment>
    );
  }
  if (left.type === DiffType.REMOVED) {
    content = (
      <RenderLine
        lineNumber={left.lineNumber}
        type={left.type}
        prefix={LineNumberPrefix.LEFT}
        value={left.value}
        renderProps={renderProps}
        additionalLineNumber={null}
      />
    );

    // this.renderLine(
    // 	left.lineNumber,
    // 	left.type,
    // 	LineNumberPrefix.LEFT,
    // 	left.value,
    // 	styles,
    // 	null,
    // );
  }
  if (left.type === DiffType.DEFAULT) {
    content = (
      <RenderLine
        lineNumber={left.lineNumber}
        type={left.type}
        prefix={LineNumberPrefix.LEFT}
        value={left.value}
        renderProps={renderProps}
        additionalLineNumber={right.lineNumber}
        additionalPrefix={LineNumberPrefix.RIGHT}
      />
    );

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
  if (right.type === DiffType.ADDED) {
    content = (
      <RenderLine
        lineNumber={null}
        type={right.type}
        prefix={LineNumberPrefix.RIGHT}
        value={right.value}
        renderProps={renderProps}
        additionalLineNumber={right.lineNumber}
      />
    );

    // content = this.renderLine(
    // 	null,
    // 	right.type,
    // 	LineNumberPrefix.RIGHT,
    // 	right.value,
    // 	styles,
    // 	right.lineNumber,
    // );
  }

  return (
    <tr key={index} className={renderProps.styles.line}>
      {content}
    </tr>
  );
}

function RenderSkippedLineIndicator({
  num,
  blockNumber,
  leftBlockLineNumber,
  rightBlockLineNumber,
  renderProps,
  expandBlockIdsSet,
  setExpandedBlockIdsSet,
}: {
  num: number;
  blockNumber: number;
  leftBlockLineNumber: number;
  rightBlockLineNumber: number;
  renderProps: ReactDiffViewerRenderProps;
  expandBlockIdsSet: Set<number>;
  setExpandedBlockIdsSet: (newState: Set<number>) => void;
}) {
  const { codeFoldMessageRenderer, hideLineNumbers, splitView } = renderProps;
  const message = codeFoldMessageRenderer ? (
    codeFoldMessageRenderer(num, leftBlockLineNumber, rightBlockLineNumber)
  ) : (
    <pre className={renderProps.styles.codeFoldContent}>
      Expand {num} lines ...
    </pre>
  );
  const content = (
    <td>
      <a
        onClick={() => {
          expandBlock(blockNumber, expandBlockIdsSet, (newState: Set<number>) => setExpandedBlockIdsSet(newState));
        }}
        tabIndex={0}
      >
        {message}
      </a>
    </td>
  );
  const isUnifiedViewWithoutLineNumbers = !splitView && !hideLineNumbers;
  return (
    <tr
      key={`${leftBlockLineNumber}-${rightBlockLineNumber}`}
      className={renderProps.styles.codeFold}
    >
      {!hideLineNumbers && <td className={renderProps.styles.codeFoldGutter} />}
      <td
        className={cn({
          [renderProps.styles.codeFoldGutter]: isUnifiedViewWithoutLineNumbers,
        })}
      />

      {/* Swap columns only for unified view without line numbers */}
      {isUnifiedViewWithoutLineNumbers ? (
        <React.Fragment>
          <td />
          {content}
        </React.Fragment>
      ) : (
        <React.Fragment>
          {content}
          <td />
        </React.Fragment>
      )}

      <td />
      <td />
    </tr>
  );
}

function Title({
  hideLineNumbers,
  leftTitle,
  rightTitle,
  splitView,
  styles,
}: ReactDiffViewerRenderProps) {
  if (!leftTitle && !rightTitle) return <></>;

  const colSpanOnSplitView = hideLineNumbers ? 2 : 3;
  const colSpanOnInlineView = hideLineNumbers ? 2 : 4;
  return (
    <tr>
      <td
        colSpan={splitView ? colSpanOnSplitView : colSpanOnInlineView}
        className={styles.titleBlock}
      >
        <pre className={styles.contentText}>{leftTitle}</pre>
      </td>
      {splitView && (
        <td colSpan={colSpanOnSplitView} className={styles.titleBlock}>
          <pre className={styles.contentText}>{rightTitle}</pre>
        </td>
      )}
    </tr>
  );
}
function DiffViewer({
  oldValue = '',
  newValue = '',
  splitView = true,
  highlightLines = [],
  disableWordDiff = false,
  compareMethod = DiffMethod.CHARS,
  styles: styleOverrides = {},
  hideLineNumbers = false,
  extraLinesSurroundingDiff = 3,
  showDiffOnly = true,
  useDarkTheme = false,
  linesOffset = 0,
  ...rest
}: ReactDiffViewerProps) {
  const [expandedBlockIdsSet, setExpandedBlockIdsSet] = React.useState<
    Set<number>
  >(new Set());
  const startTime = performance.now();
  // const {
  // 	oldValue,
  // 	newValue,
  // 	useDarkTheme,
  // 		splitView,
  // 		renderNodeWrapper,
  // 	} = props;
  const props = {
    oldValue,
    newValue,
    splitView,
    highlightLines,
    disableWordDiff,
    compareMethod,
    styles: styleOverrides,
    hideLineNumbers,
    extraLinesSurroundingDiff,
    showDiffOnly,
    useDarkTheme,
    linesOffset,
    ...rest,
  };
  if (typeof oldValue !== 'string' || typeof newValue !== 'string') {
    throw Error('"oldValue" and "newValue" should be strings');
  }

  const styles = React.useMemo(
    () => computeStyles(props.styles, useDarkTheme),
    [props.styles, useDarkTheme],
  );
  const renderProps = React.useMemo<ReactDiffViewerRenderProps>(
    () => ({
      ...props,
      styles,
    }),
    [props, styles],
  );
  const linesToRender = React.useMemo(
    () => getLinesToRender(renderProps, expandedBlockIdsSet).slice(0, 100),
    [renderProps, expandedBlockIdsSet],
  );

  return (
    <table
      className={cn(styles.diffContainer, {
        [styles.splitView]: splitView,
      })}
    >
      <tbody>
        <Title {...renderProps} />
        {linesToRender.slice(0, 100).map((line, i) => {
          let node: React.ReactElement;
          if (typeof line === 'object' && 'num' in line) {
            node = (
              <RenderSkippedLineIndicator
                {...line}
                renderProps={renderProps}
                expandBlockIdsSet={expandedBlockIdsSet}
                setExpandedBlockIdsSet={setExpandedBlockIdsSet}
              />
            );
          } else {
            const { index: lineIndex, ...lineProps } = line as LineInformationProps;
            // const lineInfo = line as LineInformationProps;
            node = splitView ? (
              <RenderSplitView
                lineInfo={lineProps}
                renderProps={renderProps}
                index={lineIndex}
              />
            ) : (
              <RenderInlineView
                lineInfo={lineProps}
                renderProps={renderProps}
                index={lineIndex}
              />
            );
          }
          return (
            <RenderNode
              key={i}
              index={i}
              renderNodeWrapper={props.renderNodeWrapper}
            >
              {node}
            </RenderNode>
          );
        })}
        {/* {renderNodeWrapper ? nodes.map((node, index) => renderNodeWrapper(node, index)) : nodes}					 */}
      </tbody>
    </table>
  );
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

export default DiffViewer;
export { ReactDiffViewerStylesOverride, DiffMethod };

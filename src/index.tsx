import * as React from "react";
import cn from "classnames";

import helpers from "./helpers";

import {
  LineInformation,
  DiffInformation,
  DiffType,
  DiffMethod,
} from "./compute-lines";
import computeStyles, {
  ReactDiffViewerStylesOverride,
  ReactDiffViewerStyles,
} from "./styles";
import getLinesToRender, {
  LineInformationProps,
  ReactDiffViewerRenderProps,
  LineNumberPrefix,
} from "./getLinesToRender";

const { expandBlock } = helpers;

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

function WordDiff({
  diffArray,
  renderer,
  styles,
}: {
  diffArray: DiffInformation[];
  renderer?: (chunk: string) => React.ReactElement;
  styles: ReactDiffViewerStyles;
}) {
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
  const highlightLine =
    renderProps.highlightLines.includes(lineNumberTemplate) ||
    renderProps.highlightLines.includes(additionalLineNumberTemplate);
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
      return (e: React.MouseEvent<HTMLTableCellElement>): void =>
        renderProps.onLineNumberClick(id, e);
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
            additionalLineNumber &&
            onLineNumberClickProxy(additionalLineNumberTemplate)
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
          {added && "+"}
          {removed && "-"}
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
          expandBlock(blockNumber, expandBlockIdsSet, (newState: Set<number>) =>
            setExpandedBlockIdsSet(newState),
          );
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
  oldValue = "",
  newValue = "",
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
  if (typeof oldValue !== "string" || typeof newValue !== "string") {
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
          if (typeof line === "object" && "num" in line) {
            node = (
              <RenderSkippedLineIndicator
                {...line}
                renderProps={renderProps}
                expandBlockIdsSet={expandedBlockIdsSet}
                setExpandedBlockIdsSet={setExpandedBlockIdsSet}
              />
            );
          } else {
            const { index: lineIndex, ...lineProps } =
              line as LineInformationProps;
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
      </tbody>
    </table>
  );
}

export default DiffViewer;
export { ReactDiffViewerStylesOverride, DiffMethod };

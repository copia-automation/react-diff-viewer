import * as React from "react";
import cn from "classnames";

import { DiffMethod, LineInformation } from "./compute-lines";
import computeStyles, {
  ReactDiffViewerStylesOverride,
} from "./Components/styles";
import { ReactDiffViewerContext, SkippedLine } from "./getLinesToRender";
import { Title } from "./Components/Title";
import { SplitView } from "./Components/SplitView";
import { Node } from "./Components/Node";
import { InlineView } from "./Components/InlineView";
import { SkippedLineIndicator } from "./Components/SkippedLineIndicator";
import { TableVirtuoso } from "react-virtuoso";
import {
  ReactDiffViewerContextProvider,
  useReactDiffViewerContext,
} from "./context";

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
  LoadingIndicator?: () => React.ReactElement;
  ErrorDisplay?: ({
    errorMessage,
  }: {
    errorMessage: string;
  }) => React.ReactElement;
}

function RenderLineFromProps({
  line,
  i,
  expandBlockById,
}: {
  line: LineInformation | SkippedLine;
  i: number;
  expandBlockById: (id: number) => void;
}) {
  const { splitView } = useReactDiffViewerContext();
  if ("num" in line) {
    return (
      <Node key={i} index={i}>
        <SkippedLineIndicator {...line} expandBlockById={expandBlockById} />
      </Node>
    );
  }

  if (splitView) {
    return (
      <Node key={i} index={i}>
        <SplitView {...line} />
      </Node>
    );
  }

  return (
    <Node key={i} index={i}>
      <InlineView {...line} />
    </Node>
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
  LoadingIndicator,
  ErrorDisplay,
  ...rest
}: ReactDiffViewerProps) {
  const [expandedBlockIdsSet, setExpandedBlockIdsSet] = React.useState<
    Set<number>
  >(new Set());
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [linesToRender, setLinesToRender] = React.useState<
    Array<LineInformation | SkippedLine>
  >([]);

  function expandBlockById(blockId: number) {
    const newState = new Set<number>([
      ...Array.from(expandedBlockIdsSet),
      blockId,
    ]);
    setExpandedBlockIdsSet(newState);
  }

  const props = {
    oldValue,
    newValue,
    splitView: false,
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
  const renderProps = React.useMemo<ReactDiffViewerContext>(
    () => ({
      ...props,
      styles,
    }),
    [props, styles],
  );

  React.useEffect(() => {
    const worker = new Worker(
      new URL("./getLinesToRender.worker.js", import.meta.url),
    );
    worker.onmessage = (e) => {
      const { success, data, error } = e.data;
      if (success) {
        setLinesToRender(data);
      } else {
        setErrorMessage(error);
      }

      setLoading(false);
    };

    worker.postMessage({
      oldValue: oldValue.slice(0, 10000),
      newValue: newValue.slice(0, 10000),
      disableWordDiff,
      compareMethod,
      linesOffset,
      extraLinesSurroundingDiff,
      showDiffOnly,
      expandedBlockIdsSet,
    });

    return () => {
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

  const largestLineNumber = React.useMemo(() => {
    return Math.max(
      oldValue.split("\n").length + 1,
      newValue.split("\n").length + 1,
    );
  }, [oldValue, newValue]);

  if (errorMessage) {
    if (ErrorDisplay) {
      return <ErrorDisplay errorMessage={errorMessage} />;
    }

    return (
      <div
        style={{
          background: "#fff",
          border: "1px solid #ff0000",
          width: "100%",
          height: "100%",
          borderRadius: 2,
        }}
      >
        <p>{errorMessage}</p>
      </div>
    );
  }

  if (loading) {
    if (LoadingIndicator) {
      return <LoadingIndicator />;
    }

    return (
      <div
        style={{
          background: "#fff",
          width: "100%",
          height: "100%",
        }}
      >
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <ReactDiffViewerContextProvider value={renderProps}>
      <TableVirtuoso
        style={{
          width: "100%",
          maxHeight: "100%",
          height: 1000,
        }}
        data={linesToRender}
        fixedHeaderContent={() => (
          <Title
            {...renderProps}
            largestPossibleLineNumber={largestLineNumber}
          />
        )}
        itemContent={(index, line) => (
          <RenderLineFromProps
            key={index}
            line={line}
            i={index}
            expandBlockById={expandBlockById}
          />
        )}
        components={{
          Table: (props: object) => (
            <table
              {...props}
              className={cn(styles.diffContainer, {
                [styles.splitView]: splitView,
              })}
              style={{
                tableLayout: "fixed",
              }}
            />
          ),
          TableRow: (props: object) => {
            // @ts-expect-error Haven't figured out props typing yet
            const item = props?.item as LineInformation | SkippedLine;
            const classNames = cn({
              [styles.codeFold]: "num" in item,
              [styles.line]: !("num" in item),
            });
            return <tr className={classNames} {...props} />;
          },
        }}
      />
    </ReactDiffViewerContextProvider>
  );
}

export default DiffViewer;
export { ReactDiffViewerStylesOverride, DiffMethod };

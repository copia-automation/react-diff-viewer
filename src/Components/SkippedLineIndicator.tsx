import { default as cn } from "classnames";
import * as React from "react";
import { ReactDiffViewerRenderProps } from "../getLinesToRender";
import { expandBlock } from "../helpers";

export function SkippedLineIndicator({
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

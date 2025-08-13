import { default as cn } from "classnames";
import * as React from "react";
import { ReactDiffViewerRenderProps } from "../getLinesToRender";

export function SkippedLineIndicator({
  num,
  blockNumber,
  leftBlockLineNumber,
  rightBlockLineNumber,
  renderProps,
  expandBlockById,
}: {
  num: number;
  blockNumber: number;
  leftBlockLineNumber: number;
  rightBlockLineNumber: number;
  renderProps: ReactDiffViewerRenderProps;
  expandBlockById: (id: number) => void;
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
          expandBlockById(blockNumber);
        }}
        tabIndex={0}
      >
        {message}
      </a>
    </td>
  );
  const isUnifiedViewWithoutLineNumbers = !splitView && !hideLineNumbers;
  return (
    <>
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
    </>
  );
}

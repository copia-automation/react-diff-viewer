import { default as cn } from "classnames";
import * as React from "react";
import { useReactDiffViewerContext } from "../context";

export function SkippedLineIndicator({
  num,
  blockNumber,
  leftBlockLineNumber,
  rightBlockLineNumber,
  expandBlockById,
}: {
  num: number;
  blockNumber: number;
  leftBlockLineNumber: number;
  rightBlockLineNumber: number;
  expandBlockById: (id: number) => void;
}) {
  const { codeFoldMessageRenderer, hideLineNumbers, splitView, styles } =
    useReactDiffViewerContext();

  const message = codeFoldMessageRenderer ? (
    codeFoldMessageRenderer(num, leftBlockLineNumber, rightBlockLineNumber)
  ) : (
    <pre className={styles.codeFoldContent}>Expand {num} lines ...</pre>
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
      {!hideLineNumbers && <td className={styles.codeFoldGutter} />}
      <td
        className={cn({
          [styles.codeFoldGutter]: isUnifiedViewWithoutLineNumbers,
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

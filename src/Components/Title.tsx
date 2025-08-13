import * as React from "react";
import { ReactDiffViewerRenderProps } from "../getLinesToRender";

interface TitleProps extends ReactDiffViewerRenderProps {
  largestPossibleLineNumber: number;
}

export function Title({
  hideLineNumbers,
  leftTitle,
  rightTitle,
  splitView,
  styles,
  largestPossibleLineNumber,
}: TitleProps) {
  if (!leftTitle && !rightTitle) return <></>;

  const colSpanOnSplitView = hideLineNumbers ? 2 : 3;
  const colSpanOnInlineView = hideLineNumbers ? 2 : 4;

  const largestLineNumberCharacters = String(largestPossibleLineNumber).length;
  const gutterWidth = largestLineNumberCharacters * 10 + 20;

  return (
    <>
      <tr style={{ height: 0 }}>
        {!hideLineNumbers && <td style={{ width: gutterWidth }} />}
        <td style={{ width: 29 }} />
        <td />
        {splitView && (
          <>
            {!hideLineNumbers && <td style={{ width: gutterWidth }} />}
            <td style={{ width: 29 }} />
            <td />
          </>
        )}
      </tr>
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
    </>
  );
}

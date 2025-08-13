import * as React from "react";
import { ReactDiffViewerRenderProps } from "../getLinesToRender";

export function Title({
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

import * as React from "react";
import { useReactDiffViewerContext } from "../context";

/**
 * We need an alignment row since we're now using the css
 * property "table-style: fixed". Since the header will always render,
 * this allows our column widths to remain consistent even on virtual.
 *
 * This is in "fixed" mode the first row sets all column widths
 */
function AlignmentRow({
  largestPossibleLineNumber,
}: {
  largestPossibleLineNumber: number;
}) {
  const { hideLineNumbers, splitView } = useReactDiffViewerContext();

  const largestLineNumberCharacters = String(largestPossibleLineNumber).length;
  const gutterWidth = largestLineNumberCharacters * 10 + 20;
  return (
    <tr style={{ height: 0 }}>
      {!hideLineNumbers && <td style={{ width: gutterWidth }} />}
      {!hideLineNumbers && !splitView && <td style={{ width: gutterWidth }} />}
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
  );
}

function TitleText() {
  const { hideLineNumbers, leftTitle, rightTitle, splitView, styles } =
    useReactDiffViewerContext();
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

export function Title({
  largestPossibleLineNumber,
}: {
  largestPossibleLineNumber: number;
}) {
  return (
    <>
      <AlignmentRow largestPossibleLineNumber={largestPossibleLineNumber} />
      <TitleText />
    </>
  );
}

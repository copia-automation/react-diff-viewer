import * as React from "react";
import { ReactDiffViewerRenderProps } from "../getLinesToRender";
import { ReactDiffViewerStyles } from "./styles";

interface TitleProps extends ReactDiffViewerRenderProps {
  largestPossibleLineNumber: number;
}

function AlignmentRow({
  hideLineNumbers,
  largestPossibleLineNumber,
  splitView,
}: {
  hideLineNumbers: boolean;
  largestPossibleLineNumber: number;
  splitView: boolean;
}) {
  const largestLineNumberCharacters = String(largestPossibleLineNumber).length;
  const gutterWidth = largestLineNumberCharacters * 10 + 20;
  return (
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
  );
}

function TitleText({
  hideLineNumbers,
  leftTitle,
  rightTitle,
  splitView,
  styles,
}: {
  hideLineNumbers: boolean;
  leftTitle?: string | React.ReactElement;
  rightTitle?: string | React.ReactElement;
  splitView: boolean;
  styles: ReactDiffViewerStyles;
}) {
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
  hideLineNumbers,
  leftTitle,
  rightTitle,
  splitView,
  styles,
  largestPossibleLineNumber,
}: TitleProps) {
  return (
    <>
      <AlignmentRow
        hideLineNumbers={hideLineNumbers}
        largestPossibleLineNumber={largestPossibleLineNumber}
        splitView={splitView}
      />
      <TitleText
        hideLineNumbers={hideLineNumbers}
        leftTitle={leftTitle}
        rightTitle={rightTitle}
        splitView={splitView}
        styles={styles}
      />
    </>
  );
}

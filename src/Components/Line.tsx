import { default as cn } from "classnames";
import * as React from "react";
import { DiffType, DiffInformation } from "../compute-lines";
import { LineNumberPrefix } from "../getLinesToRender";
import { WordDiff } from "./WordDiff";
import { useReactDiffViewerContext } from "../context";

export function Line({
  lineNumber,
  type,
  prefix,
  value,
  additionalLineNumber,
  additionalPrefix,
}: {
  lineNumber: number;
  type: DiffType;
  prefix: LineNumberPrefix;
  value: string | DiffInformation[];
  additionalLineNumber?: number;
  additionalPrefix?: LineNumberPrefix;
}) {
  const {
    highlightLines,
    renderContent,
    styles,
    onLineNumberClick,
    splitView,
    hideLineNumbers,
  } = useReactDiffViewerContext();
  const lineNumberTemplate = `${prefix}-${lineNumber}`;
  const additionalLineNumberTemplate = `${additionalPrefix}-${additionalLineNumber}`;
  const highlightLine =
    highlightLines.includes(lineNumberTemplate) ||
    highlightLines.includes(additionalLineNumberTemplate);
  const added = type === DiffType.ADDED;
  const removed = type === DiffType.REMOVED;
  let content;
  if (Array.isArray(value)) {
    content = <WordDiff diffArray={value} />;
  } else if (renderContent) {
    content = renderContent(value);
  } else {
    content = value;
  }

  function onLineNumberClickProxy(id: string) {
    if (onLineNumberClick) {
      return (e: React.MouseEvent<HTMLTableCellElement>): void =>
        onLineNumberClick(id, e);
    }
    return (): void => {};
  }

  return (
    <React.Fragment>
      {!hideLineNumbers && (
        <td
          onClick={lineNumber && onLineNumberClickProxy(lineNumberTemplate)}
          className={cn(styles.gutter, {
            [styles.emptyGutter]: !lineNumber,
            [styles.diffAdded]: added,
            [styles.diffRemoved]: removed,
            [styles.highlightedGutter]: highlightLine,
          })}
        >
          <pre className={styles.lineNumber}>{lineNumber}</pre>
        </td>
      )}
      {!splitView && !hideLineNumbers && (
        <td
          onClick={
            additionalLineNumber &&
            onLineNumberClickProxy(additionalLineNumberTemplate)
          }
          className={cn(styles.gutter, {
            [styles.emptyGutter]: !additionalLineNumber,
            [styles.diffAdded]: added,
            [styles.diffRemoved]: removed,
            [styles.highlightedGutter]: highlightLine,
          })}
        >
          <pre className={styles.lineNumber}>{additionalLineNumber}</pre>
        </td>
      )}
      <td
        className={cn(styles.marker, {
          [styles.emptyLine]: !content,
          [styles.diffAdded]: added,
          [styles.diffRemoved]: removed,
          [styles.highlightedLine]: highlightLine,
        })}
      >
        <pre>
          {added && "+"}
          {removed && "-"}
        </pre>
      </td>
      <td
        className={cn(styles.content, {
          [styles.emptyLine]: !content,
          [styles.diffAdded]: added,
          [styles.diffRemoved]: removed,
          [styles.highlightedLine]: highlightLine,
        })}
      >
        <pre className={styles.contentText}>{content}</pre>
      </td>
    </React.Fragment>
  );
}

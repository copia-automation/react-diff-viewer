import { default as cn } from "classnames";
import * as React from "react";
import { DiffType, DiffInformation } from "../compute-lines";
import {
  LineNumberPrefix,
  ReactDiffViewerRenderProps,
} from "../getLinesToRender";
import { WordDiff } from "./WordDiff";

export function Line({
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

import * as React from "react";
import { LineInformation, DiffType } from "../compute-lines";
import {
  ReactDiffViewerRenderProps,
  LineNumberPrefix,
} from "../getLinesToRender";
import { Line } from "./Line";

export function InlineView({
  lineInfo: { left, right },
  renderProps,
  index,
}: {
  lineInfo: LineInformation;
  renderProps: ReactDiffViewerRenderProps;
  index: number;
}) {
  let content;
  if (left.type === DiffType.REMOVED && right.type === DiffType.ADDED) {
    return (
      <React.Fragment key={index}>
        {/* <tr className={renderProps.styles.line}> */}
        <Line
          lineNumber={left.lineNumber}
          type={left.type}
          prefix={LineNumberPrefix.LEFT}
          value={left.value}
          renderProps={renderProps}
        />
        {/* </tr> */}
        {/* <tr className={renderProps.styles.line}> */}
        <Line
          lineNumber={null}
          type={right.type}
          prefix={LineNumberPrefix.RIGHT}
          value={right.value}
          renderProps={renderProps}
        />
        {/* </tr> */}
      </React.Fragment>
    );
  }
  if (left.type === DiffType.REMOVED) {
    content = (
      <Line
        lineNumber={left.lineNumber}
        type={left.type}
        prefix={LineNumberPrefix.LEFT}
        value={left.value}
        renderProps={renderProps}
        additionalLineNumber={null}
      />
    );
  }
  if (left.type === DiffType.DEFAULT) {
    content = (
      <Line
        lineNumber={left.lineNumber}
        type={left.type}
        prefix={LineNumberPrefix.LEFT}
        value={left.value}
        renderProps={renderProps}
        additionalLineNumber={right.lineNumber}
        additionalPrefix={LineNumberPrefix.RIGHT}
      />
    );
  }
  if (right.type === DiffType.ADDED) {
    content = (
      <Line
        lineNumber={null}
        type={right.type}
        prefix={LineNumberPrefix.RIGHT}
        value={right.value}
        renderProps={renderProps}
        additionalLineNumber={right.lineNumber}
      />
    );
  }

  return (
    <>
      {/* <tr key={index} className={renderProps.styles.line}> */}
      {content}
      {/* </tr> */}
    </>
  );
}

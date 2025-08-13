import * as React from "react";
import { LineInformation } from "../compute-lines";
import {
  ReactDiffViewerRenderProps,
  LineNumberPrefix,
} from "../getLinesToRender";
import { Line } from "./Line";

export function SplitView({
  lineInfo: { left, right },
  renderProps,
  // index,
}: {
  lineInfo: LineInformation;
  renderProps: ReactDiffViewerRenderProps;
  index: number;
}) {
  return (
    <>
      {/* <tr key={index} className={renderProps.styles.line}> */}
      <Line
        lineNumber={left.lineNumber}
        type={left.type}
        prefix={LineNumberPrefix.LEFT}
        value={left.value}
        renderProps={renderProps}
      />
      <Line
        lineNumber={right.lineNumber}
        type={right.type}
        prefix={LineNumberPrefix.RIGHT}
        value={right.value}
        renderProps={renderProps}
      />
      {/* </tr> */}
    </>
  );
}

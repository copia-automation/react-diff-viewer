import * as React from "react";
import { LineInformation } from "../compute-lines";
import { LineNumberPrefix } from "../getLinesToRender";
import { Line } from "./Line";

export function SplitView({ left, right }: LineInformation) {
  return (
    <>
      <Line
        lineNumber={left.lineNumber}
        type={left.type}
        prefix={LineNumberPrefix.LEFT}
        value={left.value}
      />
      <Line
        lineNumber={right.lineNumber}
        type={right.type}
        prefix={LineNumberPrefix.RIGHT}
        value={right.value}
      />
    </>
  );
}

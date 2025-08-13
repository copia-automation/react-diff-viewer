import * as React from "react";
import { LineInformation } from "../compute-lines";
import { ReactDiffViewerContext } from "../getLinesToRender";
export declare function SplitView({ lineInfo: { left, right }, renderProps, }: {
    lineInfo: LineInformation;
    renderProps: ReactDiffViewerContext;
}): React.JSX.Element;

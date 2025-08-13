import * as React from "react";
import { LineInformation } from "../compute-lines";
import { ReactDiffViewerRenderProps } from "../getLinesToRender";
export declare function SplitView({ lineInfo: { left, right }, renderProps, }: {
    lineInfo: LineInformation;
    renderProps: ReactDiffViewerRenderProps;
    index: number;
}): React.JSX.Element;

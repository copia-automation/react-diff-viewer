import * as React from "react";
import { LineInformation } from "../compute-lines";
import { ReactDiffViewerRenderProps } from "../getLinesToRender";
export declare function InlineView({ lineInfo: { left, right }, renderProps, index, }: {
    lineInfo: LineInformation;
    renderProps: ReactDiffViewerRenderProps;
    index: number;
}): React.JSX.Element;

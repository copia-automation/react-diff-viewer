import * as React from "react";
import { ReactDiffViewerRenderProps } from "../getLinesToRender";
export declare function SkippedLineIndicator({ num, blockNumber, leftBlockLineNumber, rightBlockLineNumber, renderProps, expandBlockById, }: {
    num: number;
    blockNumber: number;
    leftBlockLineNumber: number;
    rightBlockLineNumber: number;
    renderProps: ReactDiffViewerRenderProps;
    expandBlockById: (id: number) => void;
}): React.JSX.Element;

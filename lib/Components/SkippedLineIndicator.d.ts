import * as React from "react";
import { ReactDiffViewerRenderProps } from "../getLinesToRender";
export declare function SkippedLineIndicator({ num, blockNumber, leftBlockLineNumber, rightBlockLineNumber, renderProps, expandBlockIdsSet, setExpandedBlockIdsSet, }: {
    num: number;
    blockNumber: number;
    leftBlockLineNumber: number;
    rightBlockLineNumber: number;
    renderProps: ReactDiffViewerRenderProps;
    expandBlockIdsSet: Set<number>;
    setExpandedBlockIdsSet: (newState: Set<number>) => void;
}): React.JSX.Element;

import * as React from "react";
export declare function SkippedLineIndicator({ num, blockNumber, leftBlockLineNumber, rightBlockLineNumber, expandBlockById, }: {
    num: number;
    blockNumber: number;
    leftBlockLineNumber: number;
    rightBlockLineNumber: number;
    expandBlockById: (id: number) => void;
}): React.JSX.Element;

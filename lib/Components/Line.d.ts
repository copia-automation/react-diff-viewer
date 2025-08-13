import * as React from "react";
import { DiffType, DiffInformation } from "../compute-lines";
import { LineNumberPrefix, ReactDiffViewerRenderProps } from "../getLinesToRender";
export declare function Line({ lineNumber, type, prefix, value, additionalLineNumber, additionalPrefix, renderProps, }: {
    lineNumber: number;
    type: DiffType;
    prefix: LineNumberPrefix;
    value: string | DiffInformation[];
    additionalLineNumber?: number;
    additionalPrefix?: LineNumberPrefix;
    renderProps: ReactDiffViewerRenderProps;
}): React.JSX.Element;

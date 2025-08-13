import * as React from "react";
import { DiffType, DiffInformation } from "../compute-lines";
import { LineNumberPrefix } from "../getLinesToRender";
export declare function Line({ lineNumber, type, prefix, value, additionalLineNumber, additionalPrefix, }: {
    lineNumber: number;
    type: DiffType;
    prefix: LineNumberPrefix;
    value: string | DiffInformation[];
    additionalLineNumber?: number;
    additionalPrefix?: LineNumberPrefix;
}): React.JSX.Element;

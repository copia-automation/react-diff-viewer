import * as React from "react";
import { DiffInformation } from "../compute-lines";
import { ReactDiffViewerStyles } from "./styles";
export declare function WordDiff({ diffArray, renderer, styles, }: {
    diffArray: DiffInformation[];
    renderer?: (chunk: string) => React.ReactElement;
    styles: ReactDiffViewerStyles;
}): React.ReactElement<unknown, string | React.JSXElementConstructor<any>>[];

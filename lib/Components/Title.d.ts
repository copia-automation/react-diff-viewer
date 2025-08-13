import * as React from "react";
import { ReactDiffViewerRenderProps } from "../getLinesToRender";
interface TitleProps extends ReactDiffViewerRenderProps {
    largestPossibleLineNumber: number;
}
export declare function Title({ hideLineNumbers, leftTitle, rightTitle, splitView, styles, largestPossibleLineNumber, }: TitleProps): React.JSX.Element;
export {};

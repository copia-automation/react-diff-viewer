import * as React from "react";
import { DiffMethod } from "./compute-lines";
import { ReactDiffViewerStylesOverride } from "./Components/styles";
export interface ReactDiffViewerProps {
    oldValue: string;
    newValue: string;
    splitView?: boolean;
    linesOffset?: number;
    disableWordDiff?: boolean;
    compareMethod?: DiffMethod;
    extraLinesSurroundingDiff?: number;
    hideLineNumbers?: boolean;
    showDiffOnly?: boolean;
    renderContent?: (source: string) => React.ReactElement;
    codeFoldMessageRenderer?: (totalFoldedLines: number, leftStartLineNumber: number, rightStartLineNumber: number) => React.ReactElement;
    onLineNumberClick?: (lineId: string, event: React.MouseEvent<HTMLTableCellElement>) => void;
    highlightLines?: string[];
    styles?: ReactDiffViewerStylesOverride;
    useDarkTheme?: boolean;
    leftTitle?: string | React.ReactElement;
    rightTitle?: string | React.ReactElement;
    renderNodeWrapper?: (node: React.ReactElement, index: number) => React.ReactElement;
    LoadingIndicator?: () => React.ReactElement;
    ErrorDisplay?: ({ errorMessage, }: {
        errorMessage: string;
    }) => React.ReactElement;
}
declare function DiffViewer({ oldValue, newValue, splitView, highlightLines, disableWordDiff, compareMethod, styles: styleOverrides, hideLineNumbers, extraLinesSurroundingDiff, showDiffOnly, useDarkTheme, linesOffset, LoadingIndicator, ErrorDisplay, ...rest }: ReactDiffViewerProps): React.JSX.Element;
export default DiffViewer;
export { ReactDiffViewerStylesOverride, DiffMethod };

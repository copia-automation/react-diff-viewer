import { ReactDiffViewerProps } from ".";
import { LineInformation } from "./compute-lines";
import { ReactDiffViewerStyles } from "./styles";
export declare enum LineNumberPrefix {
    LEFT = "L",
    RIGHT = "R"
}
export type SkippedLineProps = {
    num: number;
    blockNumber: number;
    leftBlockLineNumber: number;
    rightBlockLineNumber: number;
};
export interface RenderSkippedLineProps extends SkippedLineProps {
    styles: ReactDiffViewerStyles;
}
export interface LineInformationProps extends LineInformation {
    index: number;
}
export interface ReactDiffViewerRenderProps extends ReactDiffViewerProps {
    styles: ReactDiffViewerStyles;
}
declare function getLinesToRender(renderProps: ReactDiffViewerRenderProps, expandedBlockIdsSet: Set<number>): Array<SkippedLineProps | LineInformationProps>;
export default getLinesToRender;

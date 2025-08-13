import { ReactDiffViewerProps } from ".";
import { LineInformation, DiffMethod } from "./compute-lines";
import { ReactDiffViewerStyles } from "./Components/styles";
export declare enum LineNumberPrefix {
    LEFT = "L",
    RIGHT = "R"
}
export type SkippedLine = {
    num: number;
    blockNumber: number;
    leftBlockLineNumber: number;
    rightBlockLineNumber: number;
};
export interface ReactDiffViewerContext extends ReactDiffViewerProps {
    styles: ReactDiffViewerStyles;
}
declare function getLinesToRender({ oldValue, newValue, disableWordDiff, compareMethod, linesOffset, extraLinesSurroundingDiff, showDiffOnly, expandedBlockIdsSet, }: {
    oldValue: string;
    newValue: string;
    disableWordDiff: boolean;
    compareMethod: DiffMethod;
    linesOffset: number;
    extraLinesSurroundingDiff: number;
    showDiffOnly: boolean;
    expandedBlockIdsSet: Set<number>;
}): Array<SkippedLine | LineInformation>;
export default getLinesToRender;

import { ReactDiffViewerProps } from ".";
import {
  computeLineInformation,
  LineInformation,
  DiffType,
  DiffMethod,
} from "./compute-lines";
import { ReactDiffViewerStyles } from "./Components/styles";

export enum LineNumberPrefix {
  LEFT = "L",
  RIGHT = "R",
}

export type SkippedLine = {
  num: number;
  blockNumber: number;
  leftBlockLineNumber: number;
  rightBlockLineNumber: number;
  diffIndex: number;
};

export interface ReactDiffViewerContext extends ReactDiffViewerProps {
  styles: ReactDiffViewerStyles;
}

function getLinesToRender({
  oldValue,
  newValue,
  disableWordDiff,
  compareMethod,
  linesOffset,
  extraLinesSurroundingDiff,
  showDiffOnly,
  expandedBlockIdsSet,
}: {
  oldValue: string;
  newValue: string;
  disableWordDiff: boolean;
  compareMethod: DiffMethod;
  linesOffset: number;
  extraLinesSurroundingDiff: number;
  showDiffOnly: boolean;
  expandedBlockIdsSet: Set<number>;
}): Array<SkippedLine | LineInformation> {
  const { lineInformation, diffLines } = computeLineInformation(
    oldValue,
    newValue,
    disableWordDiff,
    compareMethod,
    linesOffset,
  );
  const extraLines =
    extraLinesSurroundingDiff < 0 ? 0 : extraLinesSurroundingDiff;
  let skippedLines: number[] = [];
  let diffLinesIndex = 0;
  const lines: Array<SkippedLine | LineInformation> = [];

  lineInformation.forEach(
    (line: LineInformation, i: number): React.ReactElement => {
      const diffBlockStart = diffLines[diffLinesIndex];
      const currentPosition = diffBlockStart - i;
      if (showDiffOnly) {
        if (currentPosition === -extraLines) {
          skippedLines = [];
          diffLinesIndex += 1;
        }
        if (
          line.left.type === DiffType.DEFAULT &&
          (currentPosition > extraLines ||
            typeof diffBlockStart === "undefined") &&
          !expandedBlockIdsSet.has(diffBlockStart)
        ) {
          skippedLines.push(i + 1);
          if (i === lineInformation.length - 1 && skippedLines.length > 1) {
            lines.push({
              num: skippedLines.length,
              blockNumber: diffBlockStart,
              leftBlockLineNumber: line.left.lineNumber,
              rightBlockLineNumber: line.right.lineNumber,
              diffIndex: line.diffIndex,
            });
            return;
          }
          return null;
        }
      }

      if (currentPosition === extraLines && skippedLines.length > 0) {
        const { length } = skippedLines;
        skippedLines = [];
        lines.push({
          num: length,
          blockNumber: diffBlockStart,
          leftBlockLineNumber: line.left.lineNumber,
          rightBlockLineNumber: line.right.lineNumber,
          diffIndex: line.diffIndex,
        });
        return;
      }
      lines.push(line);
    },
  );

  return lines;
}

export default getLinesToRender;

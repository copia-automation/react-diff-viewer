import { ReactDiffViewerProps } from ".";
import {
  computeLineInformation,
  LineInformation,
  DiffType,
} from "./compute-lines";
import { ReactDiffViewerStyles } from "./styles";

export enum LineNumberPrefix {
  LEFT = "L",
  RIGHT = "R",
}

export type SkippedLineProps = {
  num: number;
  blockNumber: number;
  leftBlockLineNumber: number;
  rightBlockLineNumber: number;
  // styles: ReactDiffViewerStyles,
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

function getLinesToRender(
  renderProps: ReactDiffViewerRenderProps,
  expandedBlockIdsSet: Set<number>,
): Array<SkippedLineProps | LineInformationProps> {
  const {
    oldValue,
    newValue,
    // splitView,
    disableWordDiff,
    compareMethod,
    linesOffset,
  } = renderProps;
  const { lineInformation, diffLines } = computeLineInformation(
    oldValue,
    newValue,
    disableWordDiff,
    compareMethod,
    linesOffset,
  );
  const extraLines =
    renderProps.extraLinesSurroundingDiff < 0
      ? 0
      : renderProps.extraLinesSurroundingDiff;
  let skippedLines: number[] = [];
  let diffLinesIndex = 0;
  const lines: Array<SkippedLineProps | LineInformationProps> = [];

  lineInformation.forEach(
    (line: LineInformation, i: number): React.ReactElement => {
      const diffBlockStart = diffLines[diffLinesIndex];
      const currentPosition = diffBlockStart - i;
      if (renderProps.showDiffOnly) {
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
        });
        return;
      }
      lines.push({
        ...line,
        index: i,
      });
    },
  );

  return lines;
}

export default getLinesToRender;

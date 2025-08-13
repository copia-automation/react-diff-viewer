import { computeLineInformation, DiffType, } from "./compute-lines";
export var LineNumberPrefix;
(function (LineNumberPrefix) {
    LineNumberPrefix["LEFT"] = "L";
    LineNumberPrefix["RIGHT"] = "R";
})(LineNumberPrefix || (LineNumberPrefix = {}));
function getLinesToRender(_a) {
    var oldValue = _a.oldValue, newValue = _a.newValue, disableWordDiff = _a.disableWordDiff, compareMethod = _a.compareMethod, linesOffset = _a.linesOffset, extraLinesSurroundingDiff = _a.extraLinesSurroundingDiff, showDiffOnly = _a.showDiffOnly, expandedBlockIdsSet = _a.expandedBlockIdsSet;
    var _b = computeLineInformation(oldValue, newValue, disableWordDiff, compareMethod, linesOffset), lineInformation = _b.lineInformation, diffLines = _b.diffLines;
    var extraLines = extraLinesSurroundingDiff < 0 ? 0 : extraLinesSurroundingDiff;
    var skippedLines = [];
    var diffLinesIndex = 0;
    var lines = [];
    lineInformation.forEach(function (line, i) {
        var diffBlockStart = diffLines[diffLinesIndex];
        var currentPosition = diffBlockStart - i;
        if (showDiffOnly) {
            if (currentPosition === -extraLines) {
                skippedLines = [];
                diffLinesIndex += 1;
            }
            if (line.left.type === DiffType.DEFAULT &&
                (currentPosition > extraLines ||
                    typeof diffBlockStart === "undefined") &&
                !expandedBlockIdsSet.has(diffBlockStart)) {
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
            var length_1 = skippedLines.length;
            skippedLines = [];
            lines.push({
                num: length_1,
                blockNumber: diffBlockStart,
                leftBlockLineNumber: line.left.lineNumber,
                rightBlockLineNumber: line.right.lineNumber,
            });
            return;
        }
        lines.push(line);
    });
    return lines;
}
export default getLinesToRender;

"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineNumberPrefix = void 0;
var compute_lines_1 = require("./compute-lines");
var LineNumberPrefix;
(function (LineNumberPrefix) {
    LineNumberPrefix["LEFT"] = "L";
    LineNumberPrefix["RIGHT"] = "R";
})(LineNumberPrefix || (exports.LineNumberPrefix = LineNumberPrefix = {}));
function getLinesToRender(renderProps, expandedBlockIdsSet) {
    var oldValue = renderProps.oldValue, newValue = renderProps.newValue, 
    // splitView,
    disableWordDiff = renderProps.disableWordDiff, compareMethod = renderProps.compareMethod, linesOffset = renderProps.linesOffset;
    var _a = (0, compute_lines_1.computeLineInformation)(oldValue, newValue, disableWordDiff, compareMethod, linesOffset), lineInformation = _a.lineInformation, diffLines = _a.diffLines;
    var extraLines = renderProps.extraLinesSurroundingDiff < 0
        ? 0
        : renderProps.extraLinesSurroundingDiff;
    var skippedLines = [];
    var diffLinesIndex = 0;
    var lines = [];
    lineInformation.forEach(function (line, i) {
        var diffBlockStart = diffLines[diffLinesIndex];
        var currentPosition = diffBlockStart - i;
        if (renderProps.showDiffOnly) {
            if (currentPosition === -extraLines) {
                skippedLines = [];
                diffLinesIndex += 1;
            }
            if (line.left.type === compute_lines_1.DiffType.DEFAULT &&
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
        lines.push(__assign(__assign({}, line), { index: i }));
    });
    return lines;
}
exports.default = getLinesToRender;

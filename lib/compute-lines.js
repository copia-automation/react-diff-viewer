import * as diff from "diff";
// Create a Map of allowed diff methods to their corresponding functions
// The "Function" comes from a codeql fix. Will look at how to fix
// eslint-disable-next-line
var jsDiffMethods = new Map([
    ["diffChars", diff.diffChars],
    ["diffWords", diff.diffWords],
    ["diffWordsWithSpace", diff.diffWordsWithSpace],
    ["diffLines", diff.diffLines],
    ["diffTrimmedLines", diff.diffTrimmedLines],
    ["diffSentences", diff.diffSentences],
    ["diffCss", diff.diffCss],
]);
export var DiffType;
(function (DiffType) {
    DiffType[DiffType["DEFAULT"] = 0] = "DEFAULT";
    DiffType[DiffType["ADDED"] = 1] = "ADDED";
    DiffType[DiffType["REMOVED"] = 2] = "REMOVED";
})(DiffType || (DiffType = {}));
// See https://github.com/kpdecker/jsdiff/tree/v4.0.1#api for more info on the below JsDiff methods
export var DiffMethod;
(function (DiffMethod) {
    DiffMethod["CHARS"] = "diffChars";
    DiffMethod["WORDS"] = "diffWords";
    DiffMethod["WORDS_WITH_SPACE"] = "diffWordsWithSpace";
    DiffMethod["LINES"] = "diffLines";
    DiffMethod["TRIMMED_LINES"] = "diffTrimmedLines";
    DiffMethod["SENTENCES"] = "diffSentences";
    DiffMethod["CSS"] = "diffCss";
})(DiffMethod || (DiffMethod = {}));
/**
 * Splits diff text by new line and computes final list of diff lines based on
 * conditions.
 *
 * @param value Diff text from the js diff module.
 */
var constructLines = function (value) {
    var lines = value.split("\n");
    var isAllEmpty = lines.every(function (val) { return !val; });
    if (isAllEmpty) {
        // This is to avoid added an extra new line in the UI.
        if (lines.length === 2) {
            return [];
        }
        lines.pop();
        return lines;
    }
    var lastLine = lines[lines.length - 1];
    var firstLine = lines[0];
    // Remove the first and last element if they are new line character. This is
    // to avoid addition of extra new line in the UI.
    if (!lastLine) {
        lines.pop();
    }
    if (!firstLine) {
        lines.shift();
    }
    return lines;
};
/**
 * Computes word diff information in the line.
 * [TODO]: Consider adding options argument for JsDiff text block comparison
 *
 * @param oldValue Old word in the line.
 * @param newValue New word in the line.
 * @param compareMethod JsDiff text diff method from https://github.com/kpdecker/jsdiff/tree/v4.0.1#api
 */
var computeDiff = function (oldValue, newValue, compareMethod) {
    if (compareMethod === void 0) { compareMethod = DiffMethod.CHARS; }
    // Allowlist check: only allow valid DiffMethod values and methods present in jsDiffMethods Map
    var allowedMethods = Object.values(DiffMethod);
    var methodToUse = DiffMethod.CHARS;
    if (allowedMethods.includes(compareMethod) &&
        jsDiffMethods.has(compareMethod) &&
        typeof jsDiffMethods.get(compareMethod) === "function") {
        methodToUse = compareMethod;
    }
    var diffFn = jsDiffMethods.get(methodToUse);
    var diffArray = diffFn
        ? diffFn(oldValue, newValue)
        : [];
    var computedDiff = {
        left: [],
        right: [],
    };
    diffArray.forEach(function (_a) {
        var added = _a.added, removed = _a.removed, value = _a.value;
        var diffInformation = {};
        if (added) {
            diffInformation.type = DiffType.ADDED;
            diffInformation.value = value;
            computedDiff.right.push(diffInformation);
        }
        if (removed) {
            diffInformation.type = DiffType.REMOVED;
            diffInformation.value = value;
            computedDiff.left.push(diffInformation);
        }
        if (!removed && !added) {
            diffInformation.type = DiffType.DEFAULT;
            diffInformation.value = value;
            computedDiff.right.push(diffInformation);
            computedDiff.left.push(diffInformation);
        }
        return diffInformation;
    });
    return computedDiff;
};
/**
 * [TODO]: Think about moving common left and right value assignment to a
 * common place. Better readability?
 *
 * Computes line wise information based in the js diff information passed. Each
 * line contains information about left and right section. Left side denotes
 * deletion and right side denotes addition.
 *
 * @param oldString Old string to compare.
 * @param newString New string to compare with old string.
 * @param disableWordDiff Flag to enable/disable word diff.
 * @param compareMethod JsDiff text diff method from https://github.com/kpdecker/jsdiff/tree/v4.0.1#api
 * @param linesOffset line number to start counting from
 */
var computeLineInformation = function (oldString, newString, disableWordDiff, compareMethod, linesOffset) {
    if (disableWordDiff === void 0) { disableWordDiff = false; }
    if (compareMethod === void 0) { compareMethod = DiffMethod.CHARS; }
    if (linesOffset === void 0) { linesOffset = 0; }
    var diffArray = diff.diffLines(oldString.trimRight(), newString.trimRight(), {
        newlineIsToken: true,
        ignoreWhitespace: false,
    });
    var rightLineNumber = linesOffset;
    var leftLineNumber = linesOffset;
    var lineInformation = [];
    var counter = 0;
    var diffLines = [];
    var ignoreDiffIndexes = [];
    var getLineInformation = function (value, diffIndex, added, removed, evaluateOnlyFirstLine, isRetrieveNext) {
        var lines = constructLines(value);
        return lines.flatMap(function (line, lineIndex) {
            var left = {};
            var right = {};
            if (ignoreDiffIndexes.includes("".concat(diffIndex, "-").concat(lineIndex)) ||
                (evaluateOnlyFirstLine && lineIndex !== 0)) {
                return [];
            }
            if (added || removed) {
                if (!diffLines.includes(counter)) {
                    diffLines.push(counter);
                }
                if (removed) {
                    leftLineNumber += 1;
                    left.lineNumber = leftLineNumber;
                    left.type = DiffType.REMOVED;
                    left.value = line || " ";
                    // When the current line is of type REMOVED, check the next item in
                    // the diff array whether it is of type ADDED. If true, the current
                    // diff will be marked as both REMOVED and ADDED. Meaning, the
                    // current line is a modification.
                    var nextDiff = diffArray[diffIndex + 1];
                    if (nextDiff && nextDiff.added) {
                        var nextDiffLines = constructLines(nextDiff.value)[lineIndex];
                        if (nextDiffLines) {
                            var _a = getLineInformation(nextDiff.value, diffIndex, true, false, true, true)[0].right, rightValue = _a.value, lineNumber = _a.lineNumber, type = _a.type;
                            // When identified as modification, push the next diff to ignore
                            // list as the next value will be added in this line computation as
                            // right and left values.
                            ignoreDiffIndexes.push("".concat(diffIndex + 1, "-").concat(lineIndex));
                            right.lineNumber = lineNumber;
                            right.type = type;
                            // Do word level diff and assign the corresponding values to the
                            // left and right diff information object.
                            if (disableWordDiff) {
                                right.value = rightValue;
                            }
                            else {
                                var computedDiff = computeDiff(line, rightValue, compareMethod);
                                right.value = computedDiff.right;
                                left.value = computedDiff.left;
                            }
                        }
                    }
                }
                else {
                    rightLineNumber += 1;
                    right.lineNumber = rightLineNumber;
                    right.type = DiffType.ADDED;
                    right.value = line;
                }
            }
            else {
                leftLineNumber += 1;
                rightLineNumber += 1;
                left.lineNumber = leftLineNumber;
                left.type = DiffType.DEFAULT;
                left.value = line;
                right.lineNumber = rightLineNumber;
                right.type = DiffType.DEFAULT;
                right.value = line;
            }
            counter += 1;
            if (!isRetrieveNext) {
                lineInformation.push({
                    left: left,
                    right: right,
                });
            }
            return [{ right: right, left: left }];
        });
    };
    diffArray.forEach(function (_a, index) {
        var added = _a.added, removed = _a.removed, value = _a.value;
        getLineInformation(value, index, added, removed);
    });
    return {
        lineInformation: lineInformation,
        diffLines: diffLines,
    };
};
export { computeLineInformation };

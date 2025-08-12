const __read = (this && this.__read)
  || function (o, n) {
    let m = typeof Symbol === 'function' && o[Symbol.iterator];
    if (!m) return o;
    const i = m.call(o);
      let r;
      const ar = [];
      let e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i.return)) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
const __spreadArray = (this && this.__spreadArray)
  || function (to, from, pack) {
    if (pack || arguments.length === 2) {
 for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
}
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.computeLineInformation = exports.DiffMethod = exports.DiffType = void 0;
const diff = require('diff');

const jsDiff = diff;
let DiffType;
(function (DiffType) {
  DiffType[(DiffType.DEFAULT = 0)] = 'DEFAULT';
  DiffType[(DiffType.ADDED = 1)] = 'ADDED';
  DiffType[(DiffType.REMOVED = 2)] = 'REMOVED';
}(DiffType || (exports.DiffType = DiffType = {})));
// See https://github.com/kpdecker/jsdiff/tree/v4.0.1#api for more info on the below JsDiff methods
let DiffMethod;
(function (DiffMethod) {
  DiffMethod.CHARS = 'diffChars';
  DiffMethod.WORDS = 'diffWords';
  DiffMethod.WORDS_WITH_SPACE = 'diffWordsWithSpace';
  DiffMethod.LINES = 'diffLines';
  DiffMethod.TRIMMED_LINES = 'diffTrimmedLines';
  DiffMethod.SENTENCES = 'diffSentences';
  DiffMethod.CSS = 'diffCss';
}(DiffMethod || (exports.DiffMethod = DiffMethod = {})));
/**
 * Splits diff text by new line and computes final list of diff lines based on
 * conditions.
 *
 * @param value Diff text from the js diff module.
 */
const constructLines = function (value) {
  const lines = value.split('\n');
  const isAllEmpty = lines.every((val) => {
    return !val;
  });
  if (isAllEmpty) {
    // This is to avoid added an extra new line in the UI.
    if (lines.length === 2) {
      return [];
    }
    lines.pop();
    return lines;
  }
  const lastLine = lines[lines.length - 1];
  const firstLine = lines[0];
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
const computeDiff = function (oldValue, newValue, compareMethod) {
  if (compareMethod === void 0) {
    compareMethod = DiffMethod.CHARS;
  }
  const diffArray = jsDiff[compareMethod](oldValue, newValue);
  const computedDiff = {
    left: [],
    right: [],
  };
  diffArray.forEach((_a) => {
    const { added } = _a;
      const { removed } = _a;
      const { value } = _a;
    const diffInformation = {};
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
const computeLineInformation = function (
  oldString,
  newString,
  disableWordDiff,
  compareMethod,
  linesOffset,
) {
  if (disableWordDiff === void 0) {
    disableWordDiff = false;
  }
  if (compareMethod === void 0) {
    compareMethod = DiffMethod.CHARS;
  }
  if (linesOffset === void 0) {
    linesOffset = 0;
  }
  const diffArray = diff.diffLines(oldString.trimRight(), newString.trimRight(), {
    newlineIsToken: true,
    ignoreWhitespace: false,
    // ignoreCase: false,
  });
  let rightLineNumber = linesOffset;
  let leftLineNumber = linesOffset;
  let lineInformation = [];
  let counter = 0;
  const diffLines = [];
  const ignoreDiffIndexes = [];
  const getLineInformation = function (
    value,
    diffIndex,
    added,
    removed,
    evaluateOnlyFirstLine,
  ) {
    const lines = constructLines(value);
    return lines
      .map((line, lineIndex) => {
        const left = {};
        const right = {};
        if (
          ignoreDiffIndexes.includes(
            ''.concat(diffIndex, '-').concat(lineIndex),
          )
          || (evaluateOnlyFirstLine && lineIndex !== 0)
        ) {
          return undefined;
        }
        if (added || removed) {
          if (!diffLines.includes(counter)) {
            diffLines.push(counter);
          }
          if (removed) {
            leftLineNumber += 1;
            left.lineNumber = leftLineNumber;
            left.type = DiffType.REMOVED;
            left.value = line || ' ';
            // When the current line is of type REMOVED, check the next item in
            // the diff array whether it is of type ADDED. If true, the current
            // diff will be marked as both REMOVED and ADDED. Meaning, the
            // current line is a modification.
            const nextDiff = diffArray[diffIndex + 1];
            if (nextDiff && nextDiff.added) {
              const nextDiffLines = constructLines(nextDiff.value)[lineIndex];
              if (nextDiffLines) {
                const _a = getLineInformation(
                    nextDiff.value,
                    diffIndex,
                    true,
                    false,
                    true,
                  )[0].right;
                  const rightValue = _a.value;
                  const { lineNumber } = _a;
                  const { type } = _a;
                // When identified as modification, push the next diff to ignore
                // list as the next value will be added in this line computation as
                // right and left values.
                ignoreDiffIndexes.push(
                  ''.concat(diffIndex + 1, '-').concat(lineIndex),
                );
                right.lineNumber = lineNumber;
                right.type = type;
                // Do word level diff and assign the corresponding values to the
                // left and right diff information object.
                if (disableWordDiff) {
                  right.value = rightValue;
                } else {
                  const computedDiff = computeDiff(
                    line,
                    rightValue,
                    compareMethod,
                  );
                  right.value = computedDiff.right;
                  left.value = computedDiff.left;
                }
              }
            }
          } else {
            rightLineNumber += 1;
            right.lineNumber = rightLineNumber;
            right.type = DiffType.ADDED;
            right.value = line;
          }
        } else {
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
        return { right, left };
      })
      .filter(Boolean);
  };
  diffArray.forEach((_a, index) => {
    const { added } = _a;
      const { removed } = _a;
      const { value } = _a;
    lineInformation = __spreadArray(
      __spreadArray([], __read(lineInformation), false),
      __read(getLineInformation(value, index, added, removed)),
      false,
    );
  });
  return {
    lineInformation,
    diffLines,
  };
};
exports.computeLineInformation = computeLineInformation;

(() => {
  // node_modules/diff/libesm/diff/base.js
  var Diff = class {
    diff(oldStr, newStr, options = {}) {
      let callback;
      if (typeof options === "function") {
        callback = options;
        options = {};
      } else if ("callback" in options) {
        callback = options.callback;
      }
      const oldString = this.castInput(oldStr, options);
      const newString = this.castInput(newStr, options);
      const oldTokens = this.removeEmpty(this.tokenize(oldString, options));
      const newTokens = this.removeEmpty(this.tokenize(newString, options));
      return this.diffWithOptionsObj(oldTokens, newTokens, options, callback);
    }
    diffWithOptionsObj(oldTokens, newTokens, options, callback) {
      var _a;
      const done = (value) => {
        value = this.postProcess(value, options);
        if (callback) {
          setTimeout(function() {
            callback(value);
          }, 0);
          return void 0;
        } else {
          return value;
        }
      };
      const newLen = newTokens.length, oldLen = oldTokens.length;
      let editLength = 1;
      let maxEditLength = newLen + oldLen;
      if (options.maxEditLength != null) {
        maxEditLength = Math.min(maxEditLength, options.maxEditLength);
      }
      const maxExecutionTime = (_a = options.timeout) !== null && _a !== void 0 ? _a : Infinity;
      const abortAfterTimestamp = Date.now() + maxExecutionTime;
      const bestPath = [{ oldPos: -1, lastComponent: void 0 }];
      let newPos = this.extractCommon(bestPath[0], newTokens, oldTokens, 0, options);
      if (bestPath[0].oldPos + 1 >= oldLen && newPos + 1 >= newLen) {
        return done(this.buildValues(bestPath[0].lastComponent, newTokens, oldTokens));
      }
      let minDiagonalToConsider = -Infinity, maxDiagonalToConsider = Infinity;
      const execEditLength = () => {
        for (let diagonalPath = Math.max(minDiagonalToConsider, -editLength); diagonalPath <= Math.min(maxDiagonalToConsider, editLength); diagonalPath += 2) {
          let basePath;
          const removePath = bestPath[diagonalPath - 1], addPath = bestPath[diagonalPath + 1];
          if (removePath) {
            bestPath[diagonalPath - 1] = void 0;
          }
          let canAdd = false;
          if (addPath) {
            const addPathNewPos = addPath.oldPos - diagonalPath;
            canAdd = addPath && 0 <= addPathNewPos && addPathNewPos < newLen;
          }
          const canRemove = removePath && removePath.oldPos + 1 < oldLen;
          if (!canAdd && !canRemove) {
            bestPath[diagonalPath] = void 0;
            continue;
          }
          if (!canRemove || canAdd && removePath.oldPos < addPath.oldPos) {
            basePath = this.addToPath(addPath, true, false, 0, options);
          } else {
            basePath = this.addToPath(removePath, false, true, 1, options);
          }
          newPos = this.extractCommon(basePath, newTokens, oldTokens, diagonalPath, options);
          if (basePath.oldPos + 1 >= oldLen && newPos + 1 >= newLen) {
            return done(this.buildValues(basePath.lastComponent, newTokens, oldTokens)) || true;
          } else {
            bestPath[diagonalPath] = basePath;
            if (basePath.oldPos + 1 >= oldLen) {
              maxDiagonalToConsider = Math.min(maxDiagonalToConsider, diagonalPath - 1);
            }
            if (newPos + 1 >= newLen) {
              minDiagonalToConsider = Math.max(minDiagonalToConsider, diagonalPath + 1);
            }
          }
        }
        editLength++;
      };
      if (callback) {
        (function exec() {
          setTimeout(function() {
            if (editLength > maxEditLength || Date.now() > abortAfterTimestamp) {
              return callback(void 0);
            }
            if (!execEditLength()) {
              exec();
            }
          }, 0);
        })();
      } else {
        while (editLength <= maxEditLength && Date.now() <= abortAfterTimestamp) {
          const ret = execEditLength();
          if (ret) {
            return ret;
          }
        }
      }
    }
    addToPath(path, added, removed, oldPosInc, options) {
      const last = path.lastComponent;
      if (last && !options.oneChangePerToken && last.added === added && last.removed === removed) {
        return {
          oldPos: path.oldPos + oldPosInc,
          lastComponent: { count: last.count + 1, added, removed, previousComponent: last.previousComponent }
        };
      } else {
        return {
          oldPos: path.oldPos + oldPosInc,
          lastComponent: { count: 1, added, removed, previousComponent: last }
        };
      }
    }
    extractCommon(basePath, newTokens, oldTokens, diagonalPath, options) {
      const newLen = newTokens.length, oldLen = oldTokens.length;
      let oldPos = basePath.oldPos, newPos = oldPos - diagonalPath, commonCount = 0;
      while (newPos + 1 < newLen && oldPos + 1 < oldLen && this.equals(oldTokens[oldPos + 1], newTokens[newPos + 1], options)) {
        newPos++;
        oldPos++;
        commonCount++;
        if (options.oneChangePerToken) {
          basePath.lastComponent = { count: 1, previousComponent: basePath.lastComponent, added: false, removed: false };
        }
      }
      if (commonCount && !options.oneChangePerToken) {
        basePath.lastComponent = { count: commonCount, previousComponent: basePath.lastComponent, added: false, removed: false };
      }
      basePath.oldPos = oldPos;
      return newPos;
    }
    equals(left, right, options) {
      if (options.comparator) {
        return options.comparator(left, right);
      } else {
        return left === right || !!options.ignoreCase && left.toLowerCase() === right.toLowerCase();
      }
    }
    removeEmpty(array) {
      const ret = [];
      for (let i = 0; i < array.length; i++) {
        if (array[i]) {
          ret.push(array[i]);
        }
      }
      return ret;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    castInput(value, options) {
      return value;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    tokenize(value, options) {
      return Array.from(value);
    }
    join(chars) {
      return chars.join("");
    }
    postProcess(changeObjects, options) {
      return changeObjects;
    }
    get useLongestToken() {
      return false;
    }
    buildValues(lastComponent, newTokens, oldTokens) {
      const components = [];
      let nextComponent;
      while (lastComponent) {
        components.push(lastComponent);
        nextComponent = lastComponent.previousComponent;
        delete lastComponent.previousComponent;
        lastComponent = nextComponent;
      }
      components.reverse();
      const componentLen = components.length;
      let componentPos = 0, newPos = 0, oldPos = 0;
      for (; componentPos < componentLen; componentPos++) {
        const component = components[componentPos];
        if (!component.removed) {
          if (!component.added && this.useLongestToken) {
            let value = newTokens.slice(newPos, newPos + component.count);
            value = value.map(function(value2, i) {
              const oldValue = oldTokens[oldPos + i];
              return oldValue.length > value2.length ? oldValue : value2;
            });
            component.value = this.join(value);
          } else {
            component.value = this.join(newTokens.slice(newPos, newPos + component.count));
          }
          newPos += component.count;
          if (!component.added) {
            oldPos += component.count;
          }
        } else {
          component.value = this.join(oldTokens.slice(oldPos, oldPos + component.count));
          oldPos += component.count;
        }
      }
      return components;
    }
  };

  // node_modules/diff/libesm/diff/character.js
  var CharacterDiff = class extends Diff {
  };
  var characterDiff = new CharacterDiff();
  function diffChars(oldStr, newStr, options) {
    return characterDiff.diff(oldStr, newStr, options);
  }

  // node_modules/diff/libesm/util/string.js
  function longestCommonPrefix(str1, str2) {
    let i;
    for (i = 0; i < str1.length && i < str2.length; i++) {
      if (str1[i] != str2[i]) {
        return str1.slice(0, i);
      }
    }
    return str1.slice(0, i);
  }
  function longestCommonSuffix(str1, str2) {
    let i;
    if (!str1 || !str2 || str1[str1.length - 1] != str2[str2.length - 1]) {
      return "";
    }
    for (i = 0; i < str1.length && i < str2.length; i++) {
      if (str1[str1.length - (i + 1)] != str2[str2.length - (i + 1)]) {
        return str1.slice(-i);
      }
    }
    return str1.slice(-i);
  }
  function replacePrefix(string, oldPrefix, newPrefix) {
    if (string.slice(0, oldPrefix.length) != oldPrefix) {
      throw Error(`string ${JSON.stringify(string)} doesn't start with prefix ${JSON.stringify(oldPrefix)}; this is a bug`);
    }
    return newPrefix + string.slice(oldPrefix.length);
  }
  function replaceSuffix(string, oldSuffix, newSuffix) {
    if (!oldSuffix) {
      return string + newSuffix;
    }
    if (string.slice(-oldSuffix.length) != oldSuffix) {
      throw Error(`string ${JSON.stringify(string)} doesn't end with suffix ${JSON.stringify(oldSuffix)}; this is a bug`);
    }
    return string.slice(0, -oldSuffix.length) + newSuffix;
  }
  function removePrefix(string, oldPrefix) {
    return replacePrefix(string, oldPrefix, "");
  }
  function removeSuffix(string, oldSuffix) {
    return replaceSuffix(string, oldSuffix, "");
  }
  function maximumOverlap(string1, string2) {
    return string2.slice(0, overlapCount(string1, string2));
  }
  function overlapCount(a, b) {
    let startA = 0;
    if (a.length > b.length) {
      startA = a.length - b.length;
    }
    let endB = b.length;
    if (a.length < b.length) {
      endB = a.length;
    }
    const map = Array(endB);
    let k = 0;
    map[0] = 0;
    for (let j = 1; j < endB; j++) {
      if (b[j] == b[k]) {
        map[j] = map[k];
      } else {
        map[j] = k;
      }
      while (k > 0 && b[j] != b[k]) {
        k = map[k];
      }
      if (b[j] == b[k]) {
        k++;
      }
    }
    k = 0;
    for (let i = startA; i < a.length; i++) {
      while (k > 0 && a[i] != b[k]) {
        k = map[k];
      }
      if (a[i] == b[k]) {
        k++;
      }
    }
    return k;
  }
  function trailingWs(string) {
    let i;
    for (i = string.length - 1; i >= 0; i--) {
      if (!string[i].match(/\s/)) {
        break;
      }
    }
    return string.substring(i + 1);
  }
  function leadingWs(string) {
    const match = string.match(/^\s*/);
    return match ? match[0] : "";
  }

  // node_modules/diff/libesm/diff/word.js
  var extendedWordChars = "a-zA-Z0-9_\\u{C0}-\\u{FF}\\u{D8}-\\u{F6}\\u{F8}-\\u{2C6}\\u{2C8}-\\u{2D7}\\u{2DE}-\\u{2FF}\\u{1E00}-\\u{1EFF}";
  var tokenizeIncludingWhitespace = new RegExp(`[${extendedWordChars}]+|\\s+|[^${extendedWordChars}]`, "ug");
  var WordDiff = class extends Diff {
    equals(left, right, options) {
      if (options.ignoreCase) {
        left = left.toLowerCase();
        right = right.toLowerCase();
      }
      return left.trim() === right.trim();
    }
    tokenize(value, options = {}) {
      let parts;
      if (options.intlSegmenter) {
        const segmenter = options.intlSegmenter;
        if (segmenter.resolvedOptions().granularity != "word") {
          throw new Error('The segmenter passed must have a granularity of "word"');
        }
        parts = Array.from(segmenter.segment(value), (segment) => segment.segment);
      } else {
        parts = value.match(tokenizeIncludingWhitespace) || [];
      }
      const tokens = [];
      let prevPart = null;
      parts.forEach((part) => {
        if (/\s/.test(part)) {
          if (prevPart == null) {
            tokens.push(part);
          } else {
            tokens.push(tokens.pop() + part);
          }
        } else if (prevPart != null && /\s/.test(prevPart)) {
          if (tokens[tokens.length - 1] == prevPart) {
            tokens.push(tokens.pop() + part);
          } else {
            tokens.push(prevPart + part);
          }
        } else {
          tokens.push(part);
        }
        prevPart = part;
      });
      return tokens;
    }
    join(tokens) {
      return tokens.map((token, i) => {
        if (i == 0) {
          return token;
        } else {
          return token.replace(/^\s+/, "");
        }
      }).join("");
    }
    postProcess(changes, options) {
      if (!changes || options.oneChangePerToken) {
        return changes;
      }
      let lastKeep = null;
      let insertion = null;
      let deletion = null;
      changes.forEach((change) => {
        if (change.added) {
          insertion = change;
        } else if (change.removed) {
          deletion = change;
        } else {
          if (insertion || deletion) {
            dedupeWhitespaceInChangeObjects(lastKeep, deletion, insertion, change);
          }
          lastKeep = change;
          insertion = null;
          deletion = null;
        }
      });
      if (insertion || deletion) {
        dedupeWhitespaceInChangeObjects(lastKeep, deletion, insertion, null);
      }
      return changes;
    }
  };
  var wordDiff = new WordDiff();
  function diffWords(oldStr, newStr, options) {
    if ((options === null || options === void 0 ? void 0 : options.ignoreWhitespace) != null && !options.ignoreWhitespace) {
      return diffWordsWithSpace(oldStr, newStr, options);
    }
    return wordDiff.diff(oldStr, newStr, options);
  }
  function dedupeWhitespaceInChangeObjects(startKeep, deletion, insertion, endKeep) {
    if (deletion && insertion) {
      const oldWsPrefix = leadingWs(deletion.value);
      const oldWsSuffix = trailingWs(deletion.value);
      const newWsPrefix = leadingWs(insertion.value);
      const newWsSuffix = trailingWs(insertion.value);
      if (startKeep) {
        const commonWsPrefix = longestCommonPrefix(oldWsPrefix, newWsPrefix);
        startKeep.value = replaceSuffix(startKeep.value, newWsPrefix, commonWsPrefix);
        deletion.value = removePrefix(deletion.value, commonWsPrefix);
        insertion.value = removePrefix(insertion.value, commonWsPrefix);
      }
      if (endKeep) {
        const commonWsSuffix = longestCommonSuffix(oldWsSuffix, newWsSuffix);
        endKeep.value = replacePrefix(endKeep.value, newWsSuffix, commonWsSuffix);
        deletion.value = removeSuffix(deletion.value, commonWsSuffix);
        insertion.value = removeSuffix(insertion.value, commonWsSuffix);
      }
    } else if (insertion) {
      if (startKeep) {
        const ws = leadingWs(insertion.value);
        insertion.value = insertion.value.substring(ws.length);
      }
      if (endKeep) {
        const ws = leadingWs(endKeep.value);
        endKeep.value = endKeep.value.substring(ws.length);
      }
    } else if (startKeep && endKeep) {
      const newWsFull = leadingWs(endKeep.value), delWsStart = leadingWs(deletion.value), delWsEnd = trailingWs(deletion.value);
      const newWsStart = longestCommonPrefix(newWsFull, delWsStart);
      deletion.value = removePrefix(deletion.value, newWsStart);
      const newWsEnd = longestCommonSuffix(removePrefix(newWsFull, newWsStart), delWsEnd);
      deletion.value = removeSuffix(deletion.value, newWsEnd);
      endKeep.value = replacePrefix(endKeep.value, newWsFull, newWsEnd);
      startKeep.value = replaceSuffix(startKeep.value, newWsFull, newWsFull.slice(0, newWsFull.length - newWsEnd.length));
    } else if (endKeep) {
      const endKeepWsPrefix = leadingWs(endKeep.value);
      const deletionWsSuffix = trailingWs(deletion.value);
      const overlap = maximumOverlap(deletionWsSuffix, endKeepWsPrefix);
      deletion.value = removeSuffix(deletion.value, overlap);
    } else if (startKeep) {
      const startKeepWsSuffix = trailingWs(startKeep.value);
      const deletionWsPrefix = leadingWs(deletion.value);
      const overlap = maximumOverlap(startKeepWsSuffix, deletionWsPrefix);
      deletion.value = removePrefix(deletion.value, overlap);
    }
  }
  var WordsWithSpaceDiff = class extends Diff {
    tokenize(value) {
      const regex = new RegExp(`(\\r?\\n)|[${extendedWordChars}]+|[^\\S\\n\\r]+|[^${extendedWordChars}]`, "ug");
      return value.match(regex) || [];
    }
  };
  var wordsWithSpaceDiff = new WordsWithSpaceDiff();
  function diffWordsWithSpace(oldStr, newStr, options) {
    return wordsWithSpaceDiff.diff(oldStr, newStr, options);
  }

  // node_modules/diff/libesm/util/params.js
  function generateOptions(options, defaults) {
    if (typeof options === "function") {
      defaults.callback = options;
    } else if (options) {
      for (const name in options) {
        if (Object.prototype.hasOwnProperty.call(options, name)) {
          defaults[name] = options[name];
        }
      }
    }
    return defaults;
  }

  // node_modules/diff/libesm/diff/line.js
  var LineDiff = class extends Diff {
    constructor() {
      super(...arguments);
      this.tokenize = tokenize;
    }
    equals(left, right, options) {
      if (options.ignoreWhitespace) {
        if (!options.newlineIsToken || !left.includes("\n")) {
          left = left.trim();
        }
        if (!options.newlineIsToken || !right.includes("\n")) {
          right = right.trim();
        }
      } else if (options.ignoreNewlineAtEof && !options.newlineIsToken) {
        if (left.endsWith("\n")) {
          left = left.slice(0, -1);
        }
        if (right.endsWith("\n")) {
          right = right.slice(0, -1);
        }
      }
      return super.equals(left, right, options);
    }
  };
  var lineDiff = new LineDiff();
  function diffLines(oldStr, newStr, options) {
    return lineDiff.diff(oldStr, newStr, options);
  }
  function diffTrimmedLines(oldStr, newStr, options) {
    options = generateOptions(options, { ignoreWhitespace: true });
    return lineDiff.diff(oldStr, newStr, options);
  }
  function tokenize(value, options) {
    if (options.stripTrailingCr) {
      value = value.replace(/\r\n/g, "\n");
    }
    const retLines = [], linesAndNewlines = value.split(/(\n|\r\n)/);
    if (!linesAndNewlines[linesAndNewlines.length - 1]) {
      linesAndNewlines.pop();
    }
    for (let i = 0; i < linesAndNewlines.length; i++) {
      const line = linesAndNewlines[i];
      if (i % 2 && !options.newlineIsToken) {
        retLines[retLines.length - 1] += line;
      } else {
        retLines.push(line);
      }
    }
    return retLines;
  }

  // node_modules/diff/libesm/diff/sentence.js
  function isSentenceEndPunct(char) {
    return char == "." || char == "!" || char == "?";
  }
  var SentenceDiff = class extends Diff {
    tokenize(value) {
      var _a;
      const result = [];
      let tokenStartI = 0;
      for (let i = 0; i < value.length; i++) {
        if (i == value.length - 1) {
          result.push(value.slice(tokenStartI));
          break;
        }
        if (isSentenceEndPunct(value[i]) && value[i + 1].match(/\s/)) {
          result.push(value.slice(tokenStartI, i + 1));
          i = tokenStartI = i + 1;
          while ((_a = value[i + 1]) === null || _a === void 0 ? void 0 : _a.match(/\s/)) {
            i++;
          }
          result.push(value.slice(tokenStartI, i + 1));
          tokenStartI = i + 1;
        }
      }
      return result;
    }
  };
  var sentenceDiff = new SentenceDiff();
  function diffSentences(oldStr, newStr, options) {
    return sentenceDiff.diff(oldStr, newStr, options);
  }

  // node_modules/diff/libesm/diff/css.js
  var CssDiff = class extends Diff {
    tokenize(value) {
      return value.split(/([{}:;,]|\s+)/);
    }
  };
  var cssDiff = new CssDiff();
  function diffCss(oldStr, newStr, options) {
    return cssDiff.diff(oldStr, newStr, options);
  }

  // src/compute-lines.ts
  var jsDiffMethods = /* @__PURE__ */ new Map([
    ["diffChars", diffChars],
    ["diffWords", diffWords],
    ["diffWordsWithSpace", diffWordsWithSpace],
    ["diffLines", diffLines],
    ["diffTrimmedLines", diffTrimmedLines],
    ["diffSentences", diffSentences],
    ["diffCss", diffCss]
  ]);
  var DiffMethod = /* @__PURE__ */ ((DiffMethod3) => {
    DiffMethod3["CHARS"] = "diffChars";
    DiffMethod3["WORDS"] = "diffWords";
    DiffMethod3["WORDS_WITH_SPACE"] = "diffWordsWithSpace";
    DiffMethod3["LINES"] = "diffLines";
    DiffMethod3["TRIMMED_LINES"] = "diffTrimmedLines";
    DiffMethod3["SENTENCES"] = "diffSentences";
    DiffMethod3["CSS"] = "diffCss";
    return DiffMethod3;
  })(DiffMethod || {});
  var constructLines = (value) => {
    const lines = value.split("\n");
    const isAllEmpty = lines.every((val) => !val);
    if (isAllEmpty) {
      if (lines.length === 2) {
        return [];
      }
      lines.pop();
      return lines;
    }
    const lastLine = lines[lines.length - 1];
    const firstLine = lines[0];
    if (!lastLine) {
      lines.pop();
    }
    if (!firstLine) {
      lines.shift();
    }
    return lines;
  };
  var computeDiff = (oldValue, newValue, compareMethod = "diffChars" /* CHARS */) => {
    const allowedMethods = Object.values(DiffMethod);
    let methodToUse = "diffChars" /* CHARS */;
    if (allowedMethods.includes(compareMethod) && jsDiffMethods.has(compareMethod) && typeof jsDiffMethods.get(compareMethod) === "function") {
      methodToUse = compareMethod;
    }
    const diffFn = jsDiffMethods.get(methodToUse);
    const diffArray = diffFn ? diffFn(oldValue, newValue) : [];
    const computedDiff = {
      left: [],
      right: []
    };
    diffArray.forEach(({ added, removed, value }) => {
      const diffInformation = {};
      if (added) {
        diffInformation.type = 1 /* ADDED */;
        diffInformation.value = value;
        computedDiff.right.push(diffInformation);
      }
      if (removed) {
        diffInformation.type = 2 /* REMOVED */;
        diffInformation.value = value;
        computedDiff.left.push(diffInformation);
      }
      if (!removed && !added) {
        diffInformation.type = 0 /* DEFAULT */;
        diffInformation.value = value;
        computedDiff.right.push(diffInformation);
        computedDiff.left.push(diffInformation);
      }
      return diffInformation;
    });
    return computedDiff;
  };
  var computeLineInformation = (oldString, newString, disableWordDiff = false, compareMethod = "diffChars" /* CHARS */, linesOffset = 0) => {
    const diffArray = diffLines(
      oldString.trimRight(),
      newString.trimRight(),
      {
        newlineIsToken: true,
        ignoreWhitespace: false
      }
    );
    let rightLineNumber = linesOffset;
    let leftLineNumber = linesOffset;
    const lineInformation = [];
    let counter = 0;
    const diffLines2 = [];
    const ignoreDiffIndexes = [];
    const getLineInformation = (value, diffIndex, added, removed, evaluateOnlyFirstLine, isRetrieveNext) => {
      const lines = constructLines(value);
      return lines.flatMap((line, lineIndex) => {
        const left = {};
        const right = {};
        if (ignoreDiffIndexes.includes(`${diffIndex}-${lineIndex}`) || evaluateOnlyFirstLine && lineIndex !== 0) {
          return [];
        }
        if (added || removed) {
          if (!diffLines2.includes(counter)) {
            diffLines2.push(counter);
          }
          if (removed) {
            leftLineNumber += 1;
            left.lineNumber = leftLineNumber;
            left.type = 2 /* REMOVED */;
            left.value = line || " ";
            const nextDiff = diffArray[diffIndex + 1];
            if (nextDiff && nextDiff.added) {
              const nextDiffLines = constructLines(nextDiff.value)[lineIndex];
              if (nextDiffLines) {
                const {
                  value: rightValue,
                  lineNumber,
                  type
                } = getLineInformation(
                  nextDiff.value,
                  diffIndex,
                  true,
                  false,
                  true,
                  true
                )[0].right;
                ignoreDiffIndexes.push(`${diffIndex + 1}-${lineIndex}`);
                right.lineNumber = lineNumber;
                right.type = type;
                if (disableWordDiff) {
                  right.value = rightValue;
                } else {
                  const computedDiff = computeDiff(
                    line,
                    rightValue,
                    compareMethod
                  );
                  right.value = computedDiff.right;
                  left.value = computedDiff.left;
                }
              }
            }
          } else {
            rightLineNumber += 1;
            right.lineNumber = rightLineNumber;
            right.type = 1 /* ADDED */;
            right.value = line;
          }
        } else {
          leftLineNumber += 1;
          rightLineNumber += 1;
          left.lineNumber = leftLineNumber;
          left.type = 0 /* DEFAULT */;
          left.value = line;
          right.lineNumber = rightLineNumber;
          right.type = 0 /* DEFAULT */;
          right.value = line;
        }
        counter += 1;
        if (!isRetrieveNext) {
          lineInformation.push({
            left,
            right
          });
        }
        return [{ right, left }];
      });
    };
    diffArray.forEach(({ added, removed, value }, index) => {
      getLineInformation(value, index, added, removed);
    });
    return {
      lineInformation,
      diffLines: diffLines2
    };
  };

  // src/getLinesToRender.ts
  function getLinesToRender({
    oldValue,
    newValue,
    disableWordDiff,
    compareMethod,
    linesOffset,
    extraLinesSurroundingDiff,
    showDiffOnly,
    expandedBlockIdsSet
  }) {
    const { lineInformation, diffLines: diffLines2 } = computeLineInformation(
      oldValue,
      newValue,
      disableWordDiff,
      compareMethod,
      linesOffset
    );
    const extraLines = extraLinesSurroundingDiff < 0 ? 0 : extraLinesSurroundingDiff;
    let skippedLines = [];
    let diffLinesIndex = 0;
    const lines = [];
    lineInformation.forEach(
      (line, i) => {
        const diffBlockStart = diffLines2[diffLinesIndex];
        const currentPosition = diffBlockStart - i;
        if (showDiffOnly) {
          if (currentPosition === -extraLines) {
            skippedLines = [];
            diffLinesIndex += 1;
          }
          if (line.left.type === 0 /* DEFAULT */ && (currentPosition > extraLines || typeof diffBlockStart === "undefined") && !expandedBlockIdsSet.has(diffBlockStart)) {
            skippedLines.push(i + 1);
            if (i === lineInformation.length - 1 && skippedLines.length > 1) {
              lines.push({
                num: skippedLines.length,
                blockNumber: diffBlockStart,
                leftBlockLineNumber: line.left.lineNumber,
                rightBlockLineNumber: line.right.lineNumber
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
            rightBlockLineNumber: line.right.lineNumber
          });
          return;
        }
        lines.push(line);
      }
    );
    return lines;
  }
  var getLinesToRender_default = getLinesToRender;

  // src/getLinesToRenderWorker.ts
  console.log("Loaded RDV Worker");
  self.onmessage = function(e) {
    try {
      const argumentObject = e.data;
      const result = getLinesToRender_default(argumentObject);
      self.postMessage({ success: true, data: result });
    } catch (error) {
      self.postMessage({ success: false, error: error.message });
    } finally {
      self.close();
    }
  };
})();

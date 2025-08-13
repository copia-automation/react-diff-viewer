"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WordDiff = WordDiff;
var classnames_1 = require("classnames");
var React = require("react");
var compute_lines_1 = require("../compute-lines");
function WordDiff(_a) {
    var diffArray = _a.diffArray, renderer = _a.renderer, styles = _a.styles;
    return diffArray.map(function (wordDiff, i) {
        var _a;
        return (React.createElement("span", { key: i, className: (0, classnames_1.default)(styles.wordDiff, (_a = {},
                _a[styles.wordAdded] = wordDiff.type === compute_lines_1.DiffType.ADDED,
                _a[styles.wordRemoved] = wordDiff.type === compute_lines_1.DiffType.REMOVED,
                _a)) }, renderer
            ? renderer(wordDiff.value)
            : wordDiff.value));
    });
}

import { default as cn } from "classnames";
import * as React from "react";
import { DiffType } from "../compute-lines";
export function WordDiff(_a) {
    var diffArray = _a.diffArray, renderer = _a.renderer, styles = _a.styles;
    return diffArray.map(function (wordDiff, i) {
        var _a;
        return (React.createElement("span", { key: i, className: cn(styles.wordDiff, (_a = {},
                _a[styles.wordAdded] = wordDiff.type === DiffType.ADDED,
                _a[styles.wordRemoved] = wordDiff.type === DiffType.REMOVED,
                _a)) }, renderer
            ? renderer(wordDiff.value)
            : wordDiff.value));
    });
}

import { default as cn } from "classnames";
import * as React from "react";
import { DiffType } from "../compute-lines";
import { useReactDiffViewerContext } from "../context";
export function WordDiff(_a) {
    var diffArray = _a.diffArray;
    var _b = useReactDiffViewerContext(), renderContent = _b.renderContent, styles = _b.styles;
    return diffArray.map(function (wordDiff, i) {
        var _a;
        return (React.createElement("span", { key: i, className: cn(styles.wordDiff, (_a = {},
                _a[styles.wordAdded] = wordDiff.type === DiffType.ADDED,
                _a[styles.wordRemoved] = wordDiff.type === DiffType.REMOVED,
                _a)) }, renderContent
            ? renderContent(wordDiff.value)
            : wordDiff.value));
    });
}

import { default as cn } from "classnames";
import * as React from "react";
import { DiffInformation, DiffType } from "../compute-lines";
import { ReactDiffViewerStyles } from "./styles";

export function WordDiff({
  diffArray,
  renderer,
  styles,
}: {
  diffArray: DiffInformation[];
  renderer?: (chunk: string) => React.ReactElement;
  styles: ReactDiffViewerStyles;
}) {
  return diffArray.map((wordDiff, i): React.ReactElement => {
    return (
      <span
        key={i}
        className={cn(styles.wordDiff, {
          [styles.wordAdded]: wordDiff.type === DiffType.ADDED,
          [styles.wordRemoved]: wordDiff.type === DiffType.REMOVED,
        })}
      >
        {renderer
          ? renderer(wordDiff.value as string)
          : (wordDiff.value as string)}
      </span>
    );
  });
}

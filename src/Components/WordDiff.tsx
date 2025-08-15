import { default as cn } from "classnames";
import * as React from "react";
import { DiffInformation, DiffType } from "../compute-lines";
import { useReactDiffViewerContext } from "../context";

export function WordDiff({ diffArray }: { diffArray: DiffInformation[] }) {
  const { renderContent, styles } = useReactDiffViewerContext();
  return diffArray.map((wordDiff, i): React.ReactElement => {
    return (
      <span
        key={i}
        className={cn(styles.wordDiff, {
          [styles.wordAdded]: wordDiff.type === DiffType.ADDED,
          [styles.wordRemoved]: wordDiff.type === DiffType.REMOVED,
        })}
      >
        {renderContent
          ? renderContent(wordDiff.value as string)
          : (wordDiff.value as string)}
      </span>
    );
  });
}

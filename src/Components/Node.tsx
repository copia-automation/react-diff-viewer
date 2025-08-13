import * as React from "react";
import { useReactDiffViewerContext } from "../context";

export function Node({
  index,
  children,
}: {
  children: React.ReactElement;
  index: number;
}): React.ReactElement {
  const { renderNodeWrapper } = useReactDiffViewerContext();

  if (renderNodeWrapper) {
    return <>{renderNodeWrapper(children, index)}</>;
  }
  return <>{children}</>;
}

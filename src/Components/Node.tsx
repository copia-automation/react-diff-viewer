import * as React from "react";

export function Node({
  renderNodeWrapper,
  index,
  children,
}: {
  renderNodeWrapper?: (
    node: React.ReactElement,
    index: number,
  ) => React.ReactElement;
  children: React.ReactElement;
  index: number;
}): React.ReactElement {
  if (renderNodeWrapper) {
    return <>{renderNodeWrapper(children, index)}</>;
  }
  return <>{children}</>;
}

import * as React from "react";
import { useReactDiffViewerContext } from "../context";
export function Node(_a) {
    var index = _a.index, children = _a.children;
    var renderNodeWrapper = useReactDiffViewerContext().renderNodeWrapper;
    if (renderNodeWrapper) {
        return React.createElement(React.Fragment, null, renderNodeWrapper(children, index));
    }
    return React.createElement(React.Fragment, null, children);
}

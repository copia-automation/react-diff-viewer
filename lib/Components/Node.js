import * as React from "react";
export function Node(_a) {
    var renderNodeWrapper = _a.renderNodeWrapper, index = _a.index, children = _a.children;
    if (renderNodeWrapper) {
        return React.createElement(React.Fragment, null, renderNodeWrapper(children, index));
    }
    return React.createElement(React.Fragment, null, children);
}

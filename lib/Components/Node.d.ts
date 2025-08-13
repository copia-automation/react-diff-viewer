import * as React from "react";
export declare function Node({ renderNodeWrapper, index, children, }: {
    renderNodeWrapper?: (node: React.ReactElement, index: number) => React.ReactElement;
    children: React.ReactElement;
    index: number;
}): React.ReactElement;

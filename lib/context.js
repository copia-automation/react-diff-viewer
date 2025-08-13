import * as React from "react";
import { DiffMethod } from "./compute-lines";
var createContext = React.createContext, useContext = React.useContext;
var defaultContext = {
    oldValue: "",
    newValue: "",
    splitView: true,
    highlightLines: [],
    disableWordDiff: false,
    compareMethod: DiffMethod.CHARS,
    styles: {},
    hideLineNumbers: false,
    extraLinesSurroundingDiff: 3,
    showDiffOnly: true,
    useDarkTheme: false,
    linesOffset: 0,
};
var ReactDiffViewerContext = createContext(defaultContext);
export var ReactDiffViewerContextProvider = ReactDiffViewerContext.Provider;
export var useReactDiffViewerContext = function () {
    return useContext(ReactDiffViewerContext);
};

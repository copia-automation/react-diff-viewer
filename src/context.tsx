import * as React from "react";
import { ReactDiffViewerContext } from "./getLinesToRender";
import { DiffMethod } from "./compute-lines";

const { createContext, useContext } = React;

const defaultContext: ReactDiffViewerContext = {
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

const ReactDiffViewerContext =
  createContext<ReactDiffViewerContext>(defaultContext);

export const ReactDiffViewerContextProvider = ReactDiffViewerContext.Provider;
export const useReactDiffViewerContext = () =>
  useContext(ReactDiffViewerContext);

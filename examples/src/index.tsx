import "./style.scss";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import * as Prism from "prismjs";
import "prismjs/components/prism-javascript";

import ReactDiff, { DiffMethod } from "../../lib/index";

// eslint-disable-next-line
const oldJs = require("./diff/javascript/old.rjs").default;
// eslint-disable-next-line
const newJs = require("./diff/javascript/new.rjs").default;
// eslint-disable-next-line
const logo = require("../../logo.png");

interface ExampleState {
  splitView?: boolean;
  highlightLine?: string[];
  language?: string;
  enableSyntaxHighlighting?: boolean;
  compareMethod?: DiffMethod;
}

class Example extends React.Component<object, ExampleState> {
  public constructor(props: object) {
    super(props);
    this.state = {
      highlightLine: [],
      enableSyntaxHighlighting: true,
    };
  }

  private onLineNumberClick = (
    id: string,
    e: React.MouseEvent<HTMLTableCellElement>,
  ): void => {
    let highlightLine = [id];
    if (e.shiftKey && this.state.highlightLine?.length === 1) {
      const [dir, oldId] = this.state.highlightLine[0].split("-");
      const [newDir, newId] = id.split("-");
      if (dir === newDir) {
        highlightLine = [];
        const lowEnd = Math.min(Number(oldId), Number(newId));
        const highEnd = Math.max(Number(oldId), Number(newId));
        for (let i = lowEnd; i <= highEnd; i++) {
          highlightLine.push(`${dir}-${i}`);
        }
      }
    }
    this.setState({
      highlightLine,
    });
  };

  private syntaxHighlight = (str: string): React.ReactElement => {
    if (!str) return <></>;
    const language = Prism.highlight(
      str,
      Prism.languages.javascript,
      "javascript",
    );
    return <span dangerouslySetInnerHTML={{ __html: language }} />;
  };

  public render(): React.JSX.Element {
    return (
      <div className="react-diff-viewer-example">
        <div className="radial"></div>
        <div className="banner">
          <div className="img-container">
            <img src={logo} alt="React Diff Viewer Logo" />
          </div>
          <p>
            A simple and beautiful text diff viewer made with{" "}
            <a
              href="https://github.com/kpdecker/jsdiff"
              target="_blank"
              rel="noreferrer"
            >
              Diff{" "}
            </a>
            and{" "}
            <a href="https://reactjs.org" target="_blank" rel="noreferrer">
              React.{" "}
            </a>
            Featuring split view, inline view, word diff, line highlight and
            more.
          </p>
          <div className="cta">
            <a href="https://github.com/praneshr/react-diff-viewer#install">
              <button type="button" className="btn btn-primary btn-lg">
                Documentation
              </button>
            </a>
          </div>
        </div>
        <div className="diff-viewer" style={{ height: 800 }}>
          <ReactDiff
            highlightLines={this.state.highlightLine}
            onLineNumberClick={this.onLineNumberClick}
            oldValue={oldJs}
            splitView
            newValue={newJs}
            renderContent={this.syntaxHighlight}
            useDarkTheme={false}
            leftTitle="webpack.config.js master@2178133 - pushed 2 hours ago."
            rightTitle="webpack.config.js master@64207ee - pushed 13 hours ago."
          />
        </div>
        <footer>
          Made with 💓 by{" "}
          <a href="https://praneshravi.in" target="_blank" rel="noreferrer">
            Pranesh Ravi
          </a>
        </footer>
      </div>
    );
  }
}

const container = document.getElementById("app");
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<Example />);
} else {
  throw new Error('Root container "app" not found');
}

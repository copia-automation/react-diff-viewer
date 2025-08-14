import "@vitest/web-worker";
import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

import DiffViewer from "../lib/index";

const oldCode = `
const a = 123
const b = 456
const c = 4556
const d = 4566
const e = () => {
  console.log('c')
}
`;

const newCode = `
const a = 123
const b = 456
const c = 4556
const d = 4566
const aa = 123
const bb = 456
`;

describe("Testing react diff viewer", (): void => {
  it("It should render a table", async () => {
    render(<DiffViewer oldValue={oldCode} newValue={newCode} />);

    waitFor(() => {
      const tables = screen.getAllByRole("table");
      expect(tables.length).toEqual(1);
    });
  });

  it("It should render react-virtuoso table", async () => {
    render(<DiffViewer oldValue={oldCode} newValue={newCode} />);

    waitFor(() => {
      const tables = screen.getAllByRole("table");
      expect(tables.length).toEqual(1);

      const virtuosoEl = screen.getAllByTestId("virtuoso-item-list");
      expect(virtuosoEl.length).toEqual(1);
    });
  });
});

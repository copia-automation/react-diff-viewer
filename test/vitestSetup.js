import "@testing-library/jest-dom/vitest";
const ResizeObserver = await import("resize-observer-polyfill");
global.ResizeObserver = ResizeObserver.default;

import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PrimaryStatNode } from "./primary-stat-node";

vi.stubGlobal(
  "ResizeObserver",
  vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })),
);

vi.mock("@xyflow/react", () => ({
  Handle: () => null,
  Position: { Top: "top", Bottom: "bottom", Left: "left", Right: "right" },
}));

vi.mock("@/shared/components/sparkline", () => ({
  Sparkline: () => <div data-testid="sparkline" />,
}));

describe("PrimaryStatNode", () => {
  const baseProps = {
    id: "primary",
    data: {
      label: "Total Population",
      value: "17,900,000",
      unit: "persons",
      sparkData: [17_700_000, 17_800_000, 17_900_000],
    },
    type: "primaryStat" as const,
    selected: false,
    isConnectable: true,
    positionAbsoluteX: 0,
    positionAbsoluteY: 0,
    zIndex: 0,
    dragging: false,
    selectable: true,
    deletable: false,
    draggable: false,
  };

  it("renders the label", () => {
    render(<PrimaryStatNode {...baseProps} />);
    expect(screen.getByText("Total Population")).toBeInTheDocument();
  });

  it("renders the formatted value", () => {
    render(<PrimaryStatNode {...baseProps} />);
    expect(screen.getByText("17,900,000")).toBeInTheDocument();
  });

  it("renders the unit", () => {
    render(<PrimaryStatNode {...baseProps} />);
    expect(screen.getByText("persons")).toBeInTheDocument();
  });

  it("renders the sparkline when sparkData has 2+ items", () => {
    render(<PrimaryStatNode {...baseProps} />);
    expect(screen.getByTestId("sparkline")).toBeInTheDocument();
  });
});

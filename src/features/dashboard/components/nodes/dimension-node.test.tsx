import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DimensionNode } from "./dimension-node";

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

describe("DimensionNode", () => {
  const makeProps = (value: string, isNegative = false) => ({
    id: "dim-men",
    data: { label: "Men", value, isNegative },
    type: "dimension" as const,
    selected: false,
    isConnectable: true,
    positionAbsoluteX: 0,
    positionAbsoluteY: 0,
    zIndex: 0,
    dragging: false,
    selectable: true,
    deletable: false,
    draggable: false,
  });

  it("renders the label", () => {
    render(<DimensionNode {...makeProps("8,900,000")} />);
    expect(screen.getByText("Men")).toBeInTheDocument();
  });

  it("renders the value", () => {
    render(<DimensionNode {...makeProps("8,900,000")} />);
    expect(screen.getByText("8,900,000")).toBeInTheDocument();
  });

  it("applies red colour for negative values", () => {
    render(<DimensionNode {...makeProps("-50,000", true)} />);
    const card = screen.getByRole("region");
    expect(card.className).toMatch(/red/);
  });

  it("applies teal colour for positive values", () => {
    render(<DimensionNode {...makeProps("50,000", false)} />);
    const card = screen.getByRole("region");
    expect(card.className).toMatch(/teal/);
  });
});

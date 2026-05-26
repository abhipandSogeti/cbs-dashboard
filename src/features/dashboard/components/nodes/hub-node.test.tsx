import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { HubNode } from "./hub-node";

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

describe("HubNode", () => {
  const baseProps = {
    id: "hub",
    data: { label: "CBS Netherlands" },
    type: "hub" as const,
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
    render(<HubNode {...baseProps} />);
    expect(screen.getByText("CBS Netherlands")).toBeInTheDocument();
  });

  it("renders the CBS abbreviation badge", () => {
    render(<HubNode {...baseProps} />);
    expect(screen.getByText("CBS")).toBeInTheDocument();
  });
});

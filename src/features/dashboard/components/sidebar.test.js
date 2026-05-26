import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Sidebar } from "./sidebar";
describe("Sidebar", () => {
  it("renders the CBS brand", () => {
    render(_jsx(Sidebar, {}));
    expect(screen.getAllByText("CBS").length).toBeGreaterThan(0);
    expect(screen.getByText("Netherlands")).toBeInTheDocument();
  });
  it("renders all five view labels", () => {
    render(_jsx(Sidebar, {}));
    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Population")).toBeInTheDocument();
    expect(screen.getByText("Labour")).toBeInTheDocument();
    expect(screen.getByText("Economy")).toBeInTheDocument();
    expect(screen.getByText("Energy")).toBeInTheDocument();
  });
  it("marks the default active view with teal styles", () => {
    render(_jsx(Sidebar, {}));
    const overviewBtn = screen.getByRole("button", { name: /Overview/ });
    expect(overviewBtn.className).toContain("bg-teal-50");
    expect(overviewBtn.className).toContain("text-teal-700");
  });
  it("switches active view on click", async () => {
    render(_jsx(Sidebar, {}));
    const energyBtn = screen.getByRole("button", { name: /Energy/ });
    await userEvent.click(energyBtn);
    expect(energyBtn.className).toContain("bg-teal-50");
    expect(energyBtn.className).toContain("text-teal-700");
  });
  it("renders a DATA section label", () => {
    render(_jsx(Sidebar, {}));
    expect(screen.getByText("DATA")).toBeInTheDocument();
  });
});

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Users, TrendingUp } from "lucide-react";
import { StatsBar } from "./stats-bar";
import type { Stat } from "./stats-bar";

const stats: Stat[] = [
  {
    label: "Population",
    value: "17,890,000",
    sub: "at period start",
    icon: <Users className="h-5 w-5" />,
    trend: 2.1,
    sparkData: [17_800_000, 17_820_000, 17_850_000, 17_870_000, 17_890_000],
  },
  {
    label: "Growth",
    value: "120,000",
    sub: "annual",
    icon: <TrendingUp className="h-5 w-5" />,
  },
];

describe("StatsBar", () => {
  it("renders all stat labels and values", () => {
    render(<StatsBar stats={stats} loading={false} />);
    expect(screen.getByText("Population")).toBeInTheDocument();
    expect(screen.getByText("17,890,000")).toBeInTheDocument();
    expect(screen.getByText("Growth")).toBeInTheDocument();
  });

  it("shows skeleton placeholders when loading", () => {
    render(<StatsBar stats={stats} loading={true} />);
    expect(screen.queryByText("17,890,000")).not.toBeInTheDocument();
    expect(screen.getAllByRole("status")).toHaveLength(stats.length);
  });

  it("renders a positive trend badge", () => {
    render(<StatsBar stats={stats} loading={false} />);
    expect(screen.getByLabelText("Up 2.1 percent")).toBeInTheDocument();
  });

  it("does not render a trend badge when trend is undefined", () => {
    render(<StatsBar stats={stats} loading={false} />);
    const badges = screen.queryAllByLabelText(/^(Up|Down) \d+\.\d+ percent$/);
    expect(badges).toHaveLength(1);
  });

  it("renders sparkline SVG when sparkData is provided", () => {
    const { container } = render(<StatsBar stats={stats} loading={false} />);
    const polylines = container.querySelectorAll("polyline");
    expect(polylines.length).toBe(1);
  });

  it("renders a negative trend badge in red style", () => {
    const negStats: Stat[] = [{ label: "Test", value: "100", trend: -1.5 }];
    render(<StatsBar stats={negStats} loading={false} />);
    const badge = screen.getByLabelText("Down 1.5 percent");
    expect(badge.parentElement?.className).toContain("text-red-600");
  });
});

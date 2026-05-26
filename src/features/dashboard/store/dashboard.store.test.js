import { describe, it, expect, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useDashboardStore } from "./dashboard.store";
beforeEach(() => {
  useDashboardStore.setState(useDashboardStore.getInitialState());
});
describe("useDashboardStore", () => {
  it("starts with overview as the active view", () => {
    const { result } = renderHook(() => useDashboardStore());
    expect(result.current.activeView).toBe("overview");
  });
  it("switches active view", () => {
    const { result } = renderHook(() => useDashboardStore());
    act(() => result.current.setActiveView("energy"));
    expect(result.current.activeView).toBe("energy");
  });
  it("updates table state for a specific view without affecting others", () => {
    const { result } = renderHook(() => useDashboardStore());
    act(() =>
      result.current.setTableState("labour", { globalFilter: "Amsterdam" }),
    );
    expect(result.current.tableStates.labour.globalFilter).toBe("Amsterdam");
    expect(result.current.tableStates.population.globalFilter).toBe("");
  });
});

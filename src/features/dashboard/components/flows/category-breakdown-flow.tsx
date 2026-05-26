import { useMemo, useState, useCallback } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  type Node,
  type Edge,
  type NodeTypes,
  type NodeMouseHandler,
} from "@xyflow/react";
import { clsx } from "clsx";
import { PrimaryStatNode } from "../nodes/primary-stat-node";
import { DimensionNode } from "../nodes/dimension-node";

const nodeTypes: NodeTypes = {
  primaryStat: PrimaryStatNode as NodeTypes[string],
  dimension: DimensionNode as NodeTypes[string],
};

export type DimensionItem = {
  id: string;
  label: string;
  value: string;
  isNegative: boolean;
};

type CategoryBreakdownFlowProps = {
  periods: string[];
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  primaryLabel: string;
  primaryValue: string;
  primaryUnit?: string;
  sparkData: number[];
  dimensions: DimensionItem[];
  loading: boolean;
  error: Error | null;
};

function getDimensionPositions(count: number): Array<{ x: number; y: number }> {
  const y = 280;
  if (count === 0) return [];
  if (count === 1) return [{ x: 220, y }];
  if (count === 2)
    return [
      { x: 100, y },
      { x: 380, y },
    ];
  const step = 600 / (count - 1);
  return Array.from({ length: count }, (_, i) => ({
    x: Math.round(i * step),
    y,
  }));
}

export const CategoryBreakdownFlow = ({
  periods,
  selectedPeriod,
  onPeriodChange,
  primaryLabel,
  primaryValue,
  primaryUnit,
  sparkData,
  dimensions,
  loading,
  error,
}: CategoryBreakdownFlowProps) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const handleNodeClick = useCallback<NodeMouseHandler>((_evt, node) => {
    if (node.type === "dimension") {
      setSelectedNodeId((prev) => (prev === node.id ? null : node.id));
    }
  }, []);

  // Reset selection when subregion changes
  const handlePeriodChange = useCallback(
    (period: string) => {
      setSelectedNodeId(null);
      onPeriodChange(period);
    },
    [onPeriodChange],
  );

  const nodes: Node[] = useMemo(() => {
    if (loading) {
      return [
        {
          id: "loading",
          type: "primaryStat",
          position: { x: 220, y: 80 },
          data: { label: primaryLabel, value: "…", sparkData: [] },
          selectable: false,
          draggable: false,
        },
      ];
    }
    if (error !== null) {
      return [
        {
          id: "error",
          type: "primaryStat",
          position: { x: 200, y: 100 },
          data: {
            label: "Error loading data",
            value: error.message,
            sparkData: [],
          },
          selectable: false,
          draggable: false,
        },
      ];
    }
    const dimPositions = getDimensionPositions(dimensions.length);
    return [
      {
        id: "primary",
        type: "primaryStat",
        position: { x: 220, y: 60 },
        data: {
          label: primaryLabel,
          value: primaryValue,
          unit: primaryUnit,
          sparkData,
        },
        selectable: false,
        draggable: false,
      },
      ...dimensions.map((dim, i) => ({
        id: dim.id,
        type: "dimension",
        position: dimPositions[i] ?? { x: 0, y: 280 },
        data: {
          label: dim.label,
          value: dim.value,
          isNegative: dim.isNegative,
          isSelected: dim.id === selectedNodeId,
        },
        selectable: false,
        draggable: false,
      })),
    ];
  }, [
    loading,
    error,
    primaryLabel,
    primaryValue,
    primaryUnit,
    sparkData,
    dimensions,
    selectedNodeId,
  ]);

  const edges: Edge[] = useMemo(() => {
    if (loading || error !== null) return [];
    const hasSelection = selectedNodeId !== null;
    return dimensions.map((dim) => {
      const isSelected = dim.id === selectedNodeId;
      return {
        id: `primary-${dim.id}`,
        source: "primary",
        target: dim.id,
        animated: isSelected,
        style: {
          stroke: isSelected
            ? "#ec4899"
            : hasSelection
              ? "#cbd5e1"
              : dim.isNegative
                ? "#f87171"
                : "#0d9488",
          strokeWidth: isSelected ? 2.5 : 1.5,
          opacity: hasSelection && !isSelected ? 0.35 : 1,
        },
      };
    });
  }, [loading, error, dimensions, selectedNodeId]);

  return (
    <div className="flex flex-col gap-3">
      {periods.length > 0 && (
        <div
          className="flex gap-2 overflow-x-auto pb-1 pt-1"
          role="group"
          aria-label="Select subregion"
        >
          {periods.map((period) => (
            <button
              key={period}
              onClick={() => handlePeriodChange(period)}
              aria-pressed={period === selectedPeriod}
              className={clsx(
                "shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                period === selectedPeriod
                  ? "bg-teal-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200",
              )}
            >
              {period}
            </button>
          ))}
        </div>
      )}

      <div
        key={loading ? "loading" : selectedPeriod}
        className="h-[400px] rounded-2xl overflow-hidden border border-slate-200"
        aria-label={`${primaryLabel} data breakdown`}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          style={{ background: "#f8fafc" }}
        >
          <Background
            variant={BackgroundVariant.Lines}
            gap={32}
            size={1}
            color="#e2e8f0"
          />
        </ReactFlow>
      </div>
    </div>
  );
};

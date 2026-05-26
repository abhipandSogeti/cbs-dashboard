import { useMemo, useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Panel,
  useReactFlow,
  type Node,
  type Edge,
  type NodeTypes,
  type NodeMouseHandler,
} from "@xyflow/react";
import { clsx } from "clsx";
import { Landmark, Ruler, Users, GitMerge, X } from "lucide-react";
import { PrimaryStatNode } from "../nodes/primary-stat-node";
import { DimensionNode } from "../nodes/dimension-node";

const nodeTypes: NodeTypes = {
  primaryStat: PrimaryStatNode as NodeTypes[string],
  dimension: DimensionNode as NodeTypes[string],
};

export type CountryDetail = {
  flag: string;
  capital: string;
  area: number | undefined;
  borders: number;
  population: string;
};

export type DimensionItem = {
  id: string;
  label: string;
  value: string;
  isNegative: boolean;
  detail?: CountryDetail;
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

// ── Inner component: lives inside <ReactFlow> so useReactFlow works ──────────
type FlowControllerProps = {
  selectedNodeId: string | null;
  detail: CountryDetail | undefined;
};

const FlowController = ({ selectedNodeId, detail }: FlowControllerProps) => {
  const { fitView } = useReactFlow();
  const [visible, setVisible] = useState(false);

  // Animate camera to selected node, or reset
  useEffect(() => {
    if (selectedNodeId) {
      fitView({ nodes: [{ id: selectedNodeId }], padding: 1.0, duration: 500 });
      const t = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(t);
    } else {
      setVisible(false);
      fitView({ padding: 0.25, duration: 400 });
    }
  }, [selectedNodeId, fitView]);

  if (!detail || !selectedNodeId) return null;

  return (
    <Panel position="bottom-center" style={{ marginBottom: 12 }}>
      <div
        className="flex items-center gap-4 px-5 py-3"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible
            ? "translateY(0px) scale(1)"
            : "translateY(16px) scale(0.97)",
          transition: "opacity 0.35s ease, transform 0.35s ease",
          background: "#fff",
          border: "1px solid #e2e2e2",
          borderRadius: 8,
          boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <span className="text-3xl leading-none select-none">{detail.flag}</span>
        <div className="flex items-center gap-4">
          {detail.capital && (
            <span
              className="flex items-center gap-1.5 text-xs"
              style={{ color: "#6b7280" }}
            >
              <Landmark
                className="h-3.5 w-3.5 shrink-0"
                style={{ color: "#ff0071" }}
              />
              <span style={{ color: "#1a1a1a" }}>{detail.capital}</span>
            </span>
          )}
          {detail.area !== undefined && (
            <span
              className="flex items-center gap-1.5 text-xs"
              style={{ color: "#6b7280" }}
            >
              <Ruler
                className="h-3.5 w-3.5 shrink-0"
                style={{ color: "#ff0071" }}
              />
              <span style={{ color: "#1a1a1a" }}>
                {detail.area.toLocaleString()} km²
              </span>
            </span>
          )}
          <span
            className="flex items-center gap-1.5 text-xs"
            style={{ color: "#6b7280" }}
          >
            <Users
              className="h-3.5 w-3.5 shrink-0"
              style={{ color: "#ff0071" }}
            />
            <span style={{ color: "#1a1a1a" }}>{detail.population}</span>
          </span>
          <span
            className="flex items-center gap-1.5 text-xs"
            style={{ color: "#6b7280" }}
          >
            <GitMerge
              className="h-3.5 w-3.5 shrink-0"
              style={{ color: "#ff0071" }}
            />
            <span style={{ color: "#1a1a1a" }}>{detail.borders} borders</span>
          </span>
        </div>
        <span
          className="flex items-center gap-1 text-xs ml-1"
          style={{ color: "#b0b0b0" }}
        >
          <X className="h-3 w-3" /> dismiss
        </span>
      </div>
    </Panel>
  );
};

// ── Main export ───────────────────────────────────────────────────────────────
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

  const selectedDimension = dimensions.find((d) => d.id === selectedNodeId);

  const handleNodeClick = useCallback<NodeMouseHandler>((_evt, node) => {
    if (node.type === "dimension") {
      setSelectedNodeId((prev) => (prev === node.id ? null : node.id));
    }
  }, []);

  const handlePeriodChange = useCallback(
    (period: string) => {
      setSelectedNodeId(null);
      onPeriodChange(period);
    },
    [onPeriodChange],
  );

  const nodes: Node[] = useMemo(() => {
    if (loading)
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
    if (error !== null)
      return [
        {
          id: "error",
          type: "primaryStat",
          position: { x: 200, y: 100 },
          data: { label: "Error", value: error.message, sparkData: [] },
          selectable: false,
          draggable: false,
        },
      ];
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
          detail: dim.detail,
        },
        selectable: true,
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
    const hasSel = selectedNodeId !== null;
    return dimensions.map((dim) => {
      const isSel = dim.id === selectedNodeId;
      return {
        id: `primary-${dim.id}`,
        source: "primary",
        target: dim.id,
        animated: isSel,
        style: {
          stroke: isSel ? "#ff0071" : dim.isNegative ? "#ef4444" : "#b1b1b7",
          strokeWidth: isSel ? 2 : 1,
          strokeDasharray: isSel ? undefined : "5 4",
          opacity: hasSel && !isSel ? 0.25 : 1,
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
              style={
                period === selectedPeriod
                  ? {
                      background: "#ff0071",
                      color: "#fff",
                      border: "1px solid #ff0071",
                    }
                  : {
                      background: "#fff",
                      color: "#6b7280",
                      border: "1px solid #e2e2e2",
                    }
              }
              className="shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors"
            >
              {period}
            </button>
          ))}
        </div>
      )}

      <div
        key={loading ? "loading" : selectedPeriod}
        className="h-[420px] overflow-hidden"
        style={{ border: "1px solid #e2e2e2", borderRadius: 8 }}
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
          colorMode="light"
          style={{ background: "#fafafa" }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="#c8c8c8"
          />
          <FlowController
            selectedNodeId={selectedNodeId}
            detail={selectedDimension?.detail}
          />
        </ReactFlow>
      </div>
    </div>
  );
};

import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  type Node,
  type Edge,
  type NodeTypes,
  type NodeMouseHandler,
} from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import { HubNode } from "../nodes/hub-node";
import { CategoryNode } from "../nodes/category-node";
import { useDashboardStore, type ViewId } from "../../store/dashboard.store";

const nodeTypes: NodeTypes = {
  hub: HubNode as NodeTypes[string],
  category: CategoryNode as NodeTypes[string],
};

type CategoryKpi = {
  id: ViewId;
  label: string;
  value: string;
  trend?: number;
  Icon: LucideIcon;
};

type CbsOverviewFlowProps = {
  categories: CategoryKpi[];
  loading: boolean;
};

const HUB_POS = { x: 60, y: 190 };
const POSITIONS: Record<string, { x: number; y: number }> = {
  population: { x: 320, y: 30 },
  labour: { x: 580, y: 140 },
  economy: { x: 560, y: 320 },
  energy: { x: 300, y: 390 },
};

const EDGE_COLORS: Record<string, string> = {
  population: "#60a5fa",
  labour: "#34d399",
  economy: "#fbbf24",
  energy: "#fb923c",
};

export const CbsOverviewFlow = ({
  categories,
  loading,
}: CbsOverviewFlowProps) => {
  const { setActiveView } = useDashboardStore();

  const nodes: Node[] = useMemo(
    () => [
      {
        id: "hub",
        type: "hub",
        position: HUB_POS,
        data: { label: "World" },
        selectable: false,
        draggable: false,
      },
      ...categories.map((cat, i) => ({
        id: cat.id,
        type: "category",
        position: POSITIONS[cat.id] ?? { x: 0, y: 0 },
        data: {
          label: cat.label,
          value: loading ? "…" : cat.value,
          trend: cat.trend,
          Icon: cat.Icon,
          accentColor: EDGE_COLORS[cat.id] ?? "#ff0071",
          floatDelay: `${i * 1.1}s`,
        },
        selectable: false,
        draggable: false,
      })),
    ],
    [categories, loading],
  );

  const edges: Edge[] = useMemo(
    () =>
      categories.map((cat) => ({
        id: `hub-${cat.id}`,
        source: "hub",
        target: cat.id,
        animated: true,
        style: {
          stroke: EDGE_COLORS[cat.id] ?? "#b1b1b7",
          strokeWidth: 1.5,
          strokeDasharray: "6 4",
        },
      })),
    [categories],
  );

  const handleNodeClick = useCallback<NodeMouseHandler>(
    (_evt, node) => {
      if (node.type === "category") setActiveView(node.id as ViewId);
    },
    [setActiveView],
  );

  return (
    <div
      className="relative h-[540px] overflow-hidden"
      style={{ border: "1px solid #e2e2e2", borderRadius: 8 }}
      aria-label="World population overview"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        fitView
        fitViewOptions={{ padding: 0.18 }}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        minZoom={0.4}
        maxZoom={2}
        colorMode="light"
        style={{ background: "#fafafa" }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#c8c8c8"
        />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
};

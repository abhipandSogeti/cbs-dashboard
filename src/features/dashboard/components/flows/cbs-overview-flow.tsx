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

const HUB_POS = { x: 282, y: 210 };
const POSITIONS: Record<string, { x: number; y: number }> = {
  population: { x: 275, y: 20 },
  labour: { x: 540, y: 200 },
  economy: { x: 275, y: 380 },
  energy: { x: 10, y: 200 },
};

// Accent color per region
const EDGE_COLORS: Record<string, string> = {
  population: "#60a5fa", // blue  — Europe
  labour: "#34d399", // green — Americas
  economy: "#fbbf24", // amber — Asia
  energy: "#fb923c", // orange — Africa
};

// Deterministic particles — no Math.random so no SSR / HMR flicker
const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: `${((i * 37 + 11) % 94) + 3}%`,
  top: `${((i * 53 + 7) % 88) + 5}%`,
  size: ((i % 3) + 1.5).toFixed(1),
  duration: `${9 + (i % 7) * 2.5}s`,
  delay: `${-((i % 11) * 1.3).toFixed(1)}s`,
  color: [
    "rgba(13,148,136,0.55)",
    "rgba(96,165,250,0.45)",
    "rgba(167,139,250,0.45)",
    "rgba(52,211,153,0.45)",
    "rgba(251,191,36,0.35)",
  ][i % 5],
}));

const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {PARTICLES.map((p) => (
      <div
        key={p.id}
        className="absolute rounded-full"
        style={{
          left: p.left,
          top: p.top,
          width: `${p.size}px`,
          height: `${p.size}px`,
          background: p.color,
          boxShadow: `0 0 ${Number(p.size) * 4}px ${p.color}`,
          animation: `particle-float ${p.duration} ease-in-out ${p.delay} infinite`,
        }}
      />
    ))}
  </div>
);

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
      ...categories.map((cat) => ({
        id: cat.id,
        type: "category",
        position: POSITIONS[cat.id] ?? { x: 0, y: 0 },
        data: {
          label: cat.label,
          value: loading ? "…" : cat.value,
          trend: cat.trend,
          Icon: cat.Icon,
          accentColor: EDGE_COLORS[cat.id] ?? "#0d9488",
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
          stroke: EDGE_COLORS[cat.id] ?? "#0d9488",
          strokeWidth: 2.5,
          filter: `drop-shadow(0 0 6px ${EDGE_COLORS[cat.id] ?? "#0d9488"})`,
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
      className="relative h-[540px] rounded-2xl overflow-hidden"
      aria-label="World population overview"
    >
      <FloatingParticles />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        fitView
        fitViewOptions={{ padding: 0.18 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        style={{ background: "#060d1a" }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={28}
          size={1.2}
          color="#1e293b"
        />
        <Controls
          showInteractive={false}
          className="!border-slate-700 !bg-slate-800/80 !shadow-none [&>button]:!border-slate-700 [&>button]:!text-slate-300 [&>button:hover]:!bg-slate-700"
        />
      </ReactFlow>
    </div>
  );
};

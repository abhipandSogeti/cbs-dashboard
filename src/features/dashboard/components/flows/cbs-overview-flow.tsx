import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  type Node,
  type Edge,
  type NodeTypes,
  type NodeMouseHandler,
} from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import { HubNode } from "../nodes/hub-node";
import { CategoryNode } from "../nodes/category-node";
import { useDashboardStore, type ViewId } from "../../store/dashboard.store";

// Register node types — defined outside component to avoid recreation on render
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

// Fixed diamond layout — hub at centre, categories at compass points
const HUB_POS = { x: 282, y: 182 };
const POSITIONS: Record<string, { x: number; y: number }> = {
  population: { x: 280, y: 20 },
  labour: { x: 530, y: 180 },
  economy: { x: 280, y: 340 },
  energy: { x: 30, y: 180 },
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
      ...categories.map((cat) => ({
        id: cat.id,
        type: "category",
        position: POSITIONS[cat.id] ?? { x: 0, y: 0 },
        data: {
          label: cat.label,
          value: loading ? "…" : cat.value,
          trend: cat.trend,
          Icon: cat.Icon,
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
        style: { stroke: "#0d9488", strokeWidth: 2 },
      })),
    [categories],
  );

  const handleNodeClick = useCallback<NodeMouseHandler>(
    (_evt, node) => {
      if (node.type === "category") {
        setActiveView(node.id as ViewId);
      }
    },
    [setActiveView],
  );

  return (
    <div
      className="h-[500px] rounded-2xl overflow-hidden"
      aria-label="CBS data overview visualisation"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        style={{ background: "#0f172a" }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.5}
          color="#334155"
        />
      </ReactFlow>
    </div>
  );
};

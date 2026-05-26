import { useState, useMemo, useCallback } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Handle,
  Position,
  type Node,
  type NodeProps,
  type Edge,
  type NodeTypes,
} from "@xyflow/react";
import { useAllCountries } from "../../hooks/use-countries";
import type { Country } from "../../types/country.schema";

// ── Types ─────────────────────────────────────────────────────────────────────
type RegionId = "all" | "europe" | "americas" | "asia" | "africa";
type MetricId = "population" | "area" | "borders";

type DemoState = {
  region: RegionId;
  metric: MetricId;
  topN: number;
};

type CountryBubble = {
  flag: string;
  name: string;
  value: number;
  size: number; // px, normalised 20–60
};

// ── Deterministic positions ────────────────────────────────────────────────────
function getPositions(n: number) {
  return Array.from({ length: n }, (_, i) => ({
    x: ((i * 53 + 11) % 80) + 4,
    y: ((i * 37 + 17) % 78) + 10,
    duration: `${(2.8 + ((i * 0.41) % 2.8)).toFixed(2)}s`,
    delay: `-${((i * 0.67) % 4.5).toFixed(2)}s`,
  }));
}

// ── Output node ───────────────────────────────────────────────────────────────
type OutputNodeData = { bubbles: CountryBubble[]; metric: MetricId };
type OutputNodeType = Node<OutputNodeData, "output">;

const METRIC_LABEL: Record<MetricId, string> = {
  population: "Population",
  area: "Area (km²)",
  borders: "Border count",
};

const OutputNode = ({ data }: NodeProps<OutputNodeType>) => {
  const { bubbles, metric } = data;
  const positions = useMemo(
    () => getPositions(bubbles.length),
    [bubbles.length],
  );

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e2e2e2",
        borderRadius: 8,
        width: 480,
        height: 420,
        overflow: "hidden",
        position: "relative",
        fontFamily: "Inter, system-ui, sans-serif",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
      }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <p
        className="absolute top-3 left-4 text-xs font-medium"
        style={{ color: "#6b7280" }}
      >
        output — {METRIC_LABEL[metric]}
      </p>

      {bubbles.length === 0 && (
        <p
          className="absolute inset-0 flex items-center justify-center text-xs"
          style={{ color: "#b0b0b0" }}
        >
          No data
        </p>
      )}

      {bubbles.map((b, i) => {
        const pos = positions[i];
        if (!pos) return null;
        return (
          <div
            key={b.name}
            title={`${b.name}: ${b.value.toLocaleString()}`}
            style={{
              position: "absolute",
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              width: b.size,
              height: b.size,
              borderRadius: "50%",
              background: `rgba(255,0,113,0.12)`,
              border: `1.5px solid rgba(255,0,113,0.35)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: Math.max(10, b.size * 0.45),
              cursor: "default",
              animation: `shape-drift ${pos.duration} ease-in-out ${pos.delay} infinite`,
              transition:
                "width 0.4s cubic-bezier(0.34,1.56,0.64,1), height 0.4s cubic-bezier(0.34,1.56,0.64,1)",
              userSelect: "none",
            }}
          >
            {b.flag}
          </div>
        );
      })}
    </div>
  );
};

// ── Region node ───────────────────────────────────────────────────────────────
type RegionNodeData = { region: RegionId; onChange: (r: RegionId) => void };
type RegionNodeType = Node<RegionNodeData, "region">;

const REGIONS: Array<{ id: RegionId; label: string }> = [
  { id: "all", label: "All" },
  { id: "europe", label: "Europe" },
  { id: "americas", label: "Americas" },
  { id: "asia", label: "Asia" },
  { id: "africa", label: "Africa" },
];

const RegionNode = ({ data }: NodeProps<RegionNodeType>) => (
  <div style={nodeCard}>
    <p className="text-xs font-medium mb-2" style={{ color: "#6b7280" }}>
      region
    </p>
    <div className="flex flex-col gap-1.5">
      {REGIONS.map((r) => (
        <label
          key={r.id}
          className="flex items-center gap-2 cursor-pointer"
          style={{ fontSize: 13, color: "#1a1a1a" }}
        >
          <RadioDot active={data.region === r.id} />
          <input
            type="radio"
            name="region"
            className="sr-only"
            checked={data.region === r.id}
            onChange={() => data.onChange(r.id)}
          />
          {r.label}
        </label>
      ))}
    </div>
    <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
  </div>
);

// ── Metric node ────────────────────────────────────────────────────────────────
type MetricNodeData = { metric: MetricId; onChange: (m: MetricId) => void };
type MetricNodeType = Node<MetricNodeData, "metric">;

const METRICS: Array<{ id: MetricId; label: string }> = [
  { id: "population", label: "Population" },
  { id: "area", label: "Land area" },
  { id: "borders", label: "Borders" },
];

const MetricNode = ({ data }: NodeProps<MetricNodeType>) => (
  <div style={nodeCard}>
    <p className="text-xs font-medium mb-2" style={{ color: "#6b7280" }}>
      metric
    </p>
    <div className="flex flex-col gap-1.5">
      {METRICS.map((m) => (
        <label
          key={m.id}
          className="flex items-center gap-2 cursor-pointer"
          style={{ fontSize: 13, color: "#1a1a1a" }}
        >
          <RadioDot active={data.metric === m.id} />
          <input
            type="radio"
            name="metric"
            className="sr-only"
            checked={data.metric === m.id}
            onChange={() => data.onChange(m.id)}
          />
          {m.label}
        </label>
      ))}
    </div>
    <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
  </div>
);

// ── Top-N node ─────────────────────────────────────────────────────────────────
type TopNNodeData = { topN: number; onChange: (n: number) => void };
type TopNNodeType = Node<TopNNodeData, "topN">;

const TopNNode = ({ data }: NodeProps<TopNNodeType>) => (
  <div style={nodeCard}>
    <p className="text-xs font-medium mb-1" style={{ color: "#6b7280" }}>
      top countries
    </p>
    <p className="text-lg font-bold mb-2" style={{ color: "#ff0071" }}>
      {data.topN}
    </p>
    <input
      type="range"
      min={5}
      max={20}
      value={data.topN}
      onChange={(e) => data.onChange(Number(e.target.value))}
      style={{ width: "100%", accentColor: "#ff0071", cursor: "pointer" }}
    />
    <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
  </div>
);

// ── Shared styles & helpers ───────────────────────────────────────────────────
const nodeCard: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e2e2e2",
  borderRadius: 8,
  padding: "12px 16px",
  width: 190,
  fontFamily: "Inter, system-ui, sans-serif",
  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
};

const RadioDot = ({ active }: { active: boolean }) => (
  <span
    style={{
      width: 14,
      height: 14,
      borderRadius: "50%",
      flexShrink: 0,
      border: `2px solid ${active ? "#ff0071" : "#d1d5db"}`,
      background: active ? "#ff0071" : "transparent",
      transition: "all 0.15s",
      display: "inline-block",
    }}
  />
);

// ── Node types ─────────────────────────────────────────────────────────────────
const nodeTypes: NodeTypes = {
  region: RegionNode as NodeTypes[string],
  metric: MetricNode as NodeTypes[string],
  topN: TopNNode as NodeTypes[string],
  output: OutputNode as NodeTypes[string],
};

const EDGES: Edge[] = [
  {
    id: "r-o",
    source: "region",
    target: "output",
    style: { stroke: "#b1b1b7", strokeWidth: 1, strokeDasharray: "5 4" },
  },
  {
    id: "m-o",
    source: "metric",
    target: "output",
    style: { stroke: "#b1b1b7", strokeWidth: 1, strokeDasharray: "5 4" },
  },
  {
    id: "n-o",
    source: "topN",
    target: "output",
    style: { stroke: "#b1b1b7", strokeWidth: 1, strokeDasharray: "5 4" },
  },
];

// ── Data helpers ───────────────────────────────────────────────────────────────
function getMetricValue(c: Country, metric: MetricId): number {
  if (metric === "population") return c.population;
  if (metric === "area") return c.area ?? 0;
  return c.borders.length;
}

function buildBubbles(countries: Country[], state: DemoState): CountryBubble[] {
  const filtered =
    state.region === "all"
      ? countries
      : countries.filter((c) => c.region.toLowerCase() === state.region);

  const sorted = [...filtered]
    .filter((c) => getMetricValue(c, state.metric) > 0)
    .sort(
      (a, b) =>
        getMetricValue(b, state.metric) - getMetricValue(a, state.metric),
    )
    .slice(0, state.topN);

  if (sorted.length === 0) return [];
  const max = getMetricValue(sorted[0]!, state.metric);

  return sorted.map((c) => {
    const ratio = max > 0 ? getMetricValue(c, state.metric) / max : 0.1;
    return {
      flag: c.flag ?? "🏳",
      name: c.name.common,
      value: getMetricValue(c, state.metric),
      size: Math.round(22 + ratio * 46), // 22px–68px
    };
  });
}

// ── Main component ─────────────────────────────────────────────────────────────
export const InteractiveDemoFlow = () => {
  const { data: countries = [] } = useAllCountries();

  const [state, setState] = useState<DemoState>({
    region: "all",
    metric: "population",
    topN: 12,
  });

  const setRegion = useCallback(
    (region: RegionId) => setState((s) => ({ ...s, region })),
    [],
  );
  const setMetric = useCallback(
    (metric: MetricId) => setState((s) => ({ ...s, metric })),
    [],
  );
  const setTopN = useCallback(
    (topN: number) => setState((s) => ({ ...s, topN })),
    [],
  );

  const bubbles = useMemo(
    () => buildBubbles(countries, state),
    [countries, state],
  );

  const nodes: Node[] = useMemo(
    () => [
      {
        id: "region",
        type: "region",
        position: { x: 0, y: 0 },
        data: { region: state.region, onChange: setRegion },
        draggable: true,
      },
      {
        id: "metric",
        type: "metric",
        position: { x: 0, y: 165 },
        data: { metric: state.metric, onChange: setMetric },
        draggable: true,
      },
      {
        id: "topN",
        type: "topN",
        position: { x: 0, y: 315 },
        data: { topN: state.topN, onChange: setTopN },
        draggable: true,
      },
      {
        id: "output",
        type: "output",
        position: { x: 260, y: 0 },
        data: { bubbles, metric: state.metric },
        draggable: true,
      },
    ],
    [state, setRegion, setMetric, setTopN, bubbles],
  );

  return (
    <div
      style={{
        height: 560,
        border: "1px solid #e2e2e2",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={EDGES}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        nodesDraggable
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        nodesConnectable={false}
        elementsSelectable={false}
        colorMode="light"
        style={{ background: "#fafafa" }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#c8c8c8"
        />
      </ReactFlow>
    </div>
  );
};

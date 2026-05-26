import {
  Handle,
  NodeToolbar,
  Position,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, GripHorizontal } from "lucide-react";

type CategoryNodeData = {
  label: string;
  value: string;
  trend?: number;
  Icon: LucideIcon;
  accentColor?: string;
  floatDelay?: string;
};
type CategoryNodeType = Node<CategoryNodeData, "category">;

export const CategoryNode = ({
  data,
  dragging,
  selected,
}: NodeProps<CategoryNodeType>) => {
  const {
    label,
    value,
    trend,
    Icon,
    accentColor = "#ff0071",
    floatDelay = "0s",
  } = data;
  const isPositive = trend === undefined || trend >= 0;

  return (
    <>
      <NodeToolbar isVisible={selected} position={Position.Top} offset={8}>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{
            background: "#fff",
            border: `1px solid ${accentColor}55`,
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            color: accentColor,
            fontFamily: "Inter, system-ui, sans-serif",
            whiteSpace: "nowrap",
          }}
        >
          <Icon className="h-3.5 w-3.5" />
          <span>Open {label}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </NodeToolbar>

      <NodeToolbar isVisible={!!dragging} position={Position.Bottom} offset={6}>
        <div
          className="flex items-center gap-1 px-2 py-1 rounded text-xs"
          style={{
            background: "#1a1a1a",
            color: "#fff",
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          <GripHorizontal className="h-3 w-3 opacity-60" />
          <span>dragging</span>
        </div>
      </NodeToolbar>

      <div
        role="button"
        tabIndex={0}
        aria-label={`Navigate to ${label} view`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.currentTarget.click();
          }
        }}
        className="group relative flex flex-col items-center gap-2 w-44 px-5 py-4"
        style={{
          background: "#fff",
          border: `1px solid ${selected ? accentColor : "#e2e2e2"}`,
          borderRadius: 6,
          boxShadow: dragging
            ? `0 12px 32px rgba(0,0,0,0.18), 0 0 0 2px ${accentColor}55`
            : selected
              ? `0 0 0 3px ${accentColor}22, 0 2px 8px rgba(0,0,0,0.10)`
              : "0 1px 4px rgba(0,0,0,0.08)",
          animation: dragging
            ? "none"
            : `node-float 2.2s ease-in-out ${floatDelay} infinite`,
          transition: "box-shadow 0.2s, border-color 0.2s",
          cursor: dragging ? "grabbing" : "pointer",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
        onMouseEnter={(e) => {
          if (dragging || selected) return;
          const el = e.currentTarget as HTMLDivElement;
          el.style.boxShadow = `0 0 0 2px ${accentColor}33, 0 4px 16px rgba(0,0,0,0.10)`;
          el.style.borderColor = `${accentColor}99`;
        }}
        onMouseLeave={(e) => {
          if (dragging || selected) return;
          const el = e.currentTarget as HTMLDivElement;
          el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.08)";
          el.style.borderColor = "#e2e2e2";
        }}
      >
        <Handle
          type="target"
          position={Position.Bottom}
          style={{ opacity: 0 }}
        />
        <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
        <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
        <Handle
          type="target"
          position={Position.Right}
          style={{ opacity: 0 }}
        />

        {/* top accent line */}
        <span
          className="absolute top-0 left-6 right-6 h-px rounded-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
          }}
        />

        <span
          className="flex h-9 w-9 items-center justify-center rounded-lg"
          style={{ background: `${accentColor}14`, color: accentColor }}
        >
          <Icon className="h-4 w-4" />
        </span>

        <p
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: accentColor }}
        >
          {label}
        </p>

        <p
          className="text-xl font-bold text-center"
          style={{ color: "#1a1a1a" }}
        >
          {value}
        </p>

        {trend !== undefined && (
          <span
            className="rounded-full px-2 py-0.5 text-xs font-medium"
            style={{
              background: isPositive
                ? "rgba(34,197,94,0.10)"
                : "rgba(239,68,68,0.10)",
              color: isPositive ? "#16a34a" : "#dc2626",
              border: `1px solid ${isPositive ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
            }}
            aria-label={`${isPositive ? "Up" : "Down"} ${Math.abs(trend).toFixed(1)} percent`}
          >
            {isPositive ? "↑" : "↓"} {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>
    </>
  );
};

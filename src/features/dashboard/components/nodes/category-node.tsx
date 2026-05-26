import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";

type CategoryNodeData = {
  label: string;
  value: string;
  trend?: number;
  Icon: LucideIcon;
  accentColor?: string;
};
type CategoryNodeType = Node<CategoryNodeData, "category">;

export const CategoryNode = ({ data }: NodeProps<CategoryNodeType>) => {
  const { label, value, trend, Icon, accentColor = "#0d9488" } = data;
  const isPositive = trend === undefined || trend >= 0;

  return (
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
      className="group relative flex flex-col items-center gap-2 rounded-2xl px-5 py-4 w-44 cursor-pointer transition-transform duration-200 hover:scale-105"
      style={{
        background: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(12px)",
        border: `1px solid ${accentColor}55`,
        boxShadow: `0 0 0 0 ${accentColor}00, 0 4px 24px rgba(0,0,0,0.4)`,
        transition: "box-shadow 0.25s ease, transform 0.2s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          `0 0 24px ${accentColor}55, 0 0 48px ${accentColor}22, 0 4px 24px rgba(0,0,0,0.4)`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          `0 0 0 0 ${accentColor}00, 0 4px 24px rgba(0,0,0,0.4)`;
      }}
    >
      <Handle type="target" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Right} style={{ opacity: 0 }} />

      {/* Top accent line */}
      <span
        className="absolute top-0 left-6 right-6 h-px rounded-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
        }}
      />

      <span
        className="flex h-10 w-10 items-center justify-center rounded-xl"
        style={{
          background: `${accentColor}22`,
          border: `1px solid ${accentColor}44`,
          color: accentColor,
        }}
      >
        <Icon className="h-5 w-5" />
      </span>

      <p
        className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: accentColor }}
      >
        {label}
      </p>

      <p className="text-xl font-bold text-white text-center leading-tight">
        {value}
      </p>

      {trend !== undefined && (
        <span
          className="rounded-full px-2 py-0.5 text-xs font-medium"
          style={{
            background: isPositive
              ? "rgba(52,211,153,0.15)"
              : "rgba(248,113,113,0.15)",
            color: isPositive ? "#34d399" : "#f87171",
            border: `1px solid ${isPositive ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"}`,
          }}
          aria-label={`${isPositive ? "Up" : "Down"} ${Math.abs(trend).toFixed(1)} percent`}
        >
          {isPositive ? "↑" : "↓"} {Math.abs(trend).toFixed(1)}%
        </span>
      )}
    </div>
  );
};

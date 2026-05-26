import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { Sparkline } from "@/shared/components/sparkline";

type PrimaryStatNodeData = {
  label: string;
  value: string;
  unit?: string;
  sparkData: number[];
};
type PrimaryStatNodeType = Node<PrimaryStatNodeData, "primaryStat">;

export const PrimaryStatNode = ({ data }: NodeProps<PrimaryStatNodeType>) => {
  const { label, value, unit, sparkData } = data;

  return (
    <div
      className="flex flex-col items-center w-56 px-8 py-5"
      style={{
        background: "#fff",
        border: "1px solid #e2e2e2",
        borderRadius: 6,
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />

      <p
        className="text-xs font-medium uppercase tracking-widest"
        style={{ color: "#9ca3af" }}
      >
        {label}
      </p>
      <p className="mt-1 text-3xl font-bold" style={{ color: "#1a1a1a" }}>
        {value}
      </p>
      {unit !== undefined && (
        <p className="mt-0.5 text-xs" style={{ color: "#b0b0b0" }}>
          {unit}
        </p>
      )}
      {sparkData.length >= 2 && (
        <Sparkline data={sparkData} className="mt-3 h-10 w-full" />
      )}

      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  );
};

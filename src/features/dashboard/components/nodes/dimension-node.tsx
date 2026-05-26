import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { clsx } from "clsx";

type DimensionNodeData = {
  label: string;
  value: string;
  isNegative: boolean;
};
type DimensionNodeType = Node<DimensionNodeData, "dimension">;

export const DimensionNode = ({ data }: NodeProps<DimensionNodeType>) => {
  const { label, value, isNegative } = data;

  return (
    <div
      role="region"
      aria-label={`${label}: ${value}`}
      className={clsx(
        "flex flex-col items-center rounded-xl border px-5 py-3 shadow-sm w-36",
        isNegative ? "border-red-200 bg-red-50" : "border-teal-200 bg-teal-50",
      )}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Right} style={{ opacity: 0 }} />

      <p
        className={clsx(
          "text-xs font-medium",
          isNegative ? "text-red-500" : "text-teal-600",
        )}
      >
        {label}
      </p>
      <p
        className={clsx(
          "mt-1 text-xl font-bold",
          isNegative ? "text-red-700" : "text-slate-900",
        )}
      >
        {value}
      </p>
    </div>
  );
};

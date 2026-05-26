import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { clsx } from "clsx";

type DimensionNodeData = {
  label: string;
  value: string;
  isNegative: boolean;
  isSelected?: boolean;
};
type DimensionNodeType = Node<DimensionNodeData, "dimension">;

export const DimensionNode = ({ data }: NodeProps<DimensionNodeType>) => {
  const { label, value, isNegative, isSelected = false } = data;

  return (
    <div
      role="region"
      aria-label={`${label}: ${value}`}
      className={clsx(
        "flex flex-col items-center rounded-xl border px-5 py-3 w-36 transition-all duration-200 cursor-pointer",
        isSelected
          ? "border-pink-400 bg-pink-50 shadow-lg shadow-pink-200 ring-2 ring-pink-300 ring-offset-1 scale-105"
          : isNegative
            ? "border-red-200 bg-red-50 shadow-sm"
            : "border-teal-200 bg-teal-50 shadow-sm hover:border-pink-300 hover:shadow-pink-100 hover:shadow-md",
      )}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Right} style={{ opacity: 0 }} />

      <p
        className={clsx(
          "text-xs font-medium",
          isSelected
            ? "text-pink-500"
            : isNegative
              ? "text-red-500"
              : "text-teal-600",
        )}
      >
        {label}
      </p>
      <p
        className={clsx(
          "mt-1 text-xl font-bold",
          isSelected
            ? "text-pink-700"
            : isNegative
              ? "text-red-700"
              : "text-slate-900",
        )}
      >
        {value}
      </p>
    </div>
  );
};

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
    <div className="flex flex-col items-center rounded-2xl border-2 border-teal-500 bg-white px-8 py-6 shadow-lg w-56">
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />

      <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-4xl font-bold text-slate-900">{value}</p>
      {unit !== undefined && (
        <p className="mt-0.5 text-xs text-slate-400">{unit}</p>
      )}
      {sparkData.length >= 2 && (
        <Sparkline data={sparkData} className="mt-4 h-10 w-full" />
      )}

      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  );
};

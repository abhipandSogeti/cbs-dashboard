import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";

type HubNodeData = { label: string };
type HubNodeType = Node<HubNodeData, "hub">;

export const HubNode = ({ data }: NodeProps<HubNodeType>) => (
  <div
    className="relative flex flex-col items-center justify-center w-36 h-36 rounded-full"
    style={{
      background: "#fff",
      border: "2px solid #ff0071",
      boxShadow:
        "0 0 0 6px rgba(255,0,113,0.08), 0 4px 20px rgba(255,0,113,0.15)",
      fontFamily: "Inter, system-ui, sans-serif",
    }}
  >
    {/* Outer ping ring */}
    <span
      className="absolute rounded-full"
      style={{
        inset: -14,
        border: "1px solid rgba(255,0,113,0.18)",
        borderRadius: "50%",
        animation: "orbit-pulse 3s ease-in-out infinite",
      }}
    />
    <span
      className="absolute rounded-full"
      style={{
        inset: -26,
        border: "1px solid rgba(255,0,113,0.10)",
        borderRadius: "50%",
        animation: "orbit-pulse 3s ease-in-out 1s infinite",
      }}
    />

    <span className="text-3xl leading-none">🌍</span>
    <p
      className="mt-1 text-xs font-semibold text-center px-2"
      style={{ color: "#ff0071" }}
    >
      {data.label}
    </p>

    <Handle
      type="source"
      position={Position.Top}
      id="top"
      style={{ opacity: 0 }}
    />
    <Handle
      type="source"
      position={Position.Right}
      id="right"
      style={{ opacity: 0 }}
    />
    <Handle
      type="source"
      position={Position.Bottom}
      id="bottom"
      style={{ opacity: 0 }}
    />
    <Handle
      type="source"
      position={Position.Left}
      id="left"
      style={{ opacity: 0 }}
    />
  </div>
);

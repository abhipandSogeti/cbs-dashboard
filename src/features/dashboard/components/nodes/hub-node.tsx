import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";

type HubNodeData = { label: string };
type HubNodeType = Node<HubNodeData, "hub">;

export const HubNode = ({ data }: NodeProps<HubNodeType>) => (
  <div className="relative flex flex-col items-center justify-center w-40 h-40 rounded-full">
    {/* Outer orbit rings */}
    <span
      className="absolute rounded-full border border-teal-400/20"
      style={{
        inset: "-20px",
        animation: "orbit-pulse 3s ease-in-out infinite",
      }}
    />
    <span
      className="absolute rounded-full border border-teal-400/15"
      style={{
        inset: "-36px",
        animation: "orbit-pulse 3s ease-in-out 1s infinite",
      }}
    />
    <span
      className="absolute rounded-full border border-teal-400/10"
      style={{
        inset: "-52px",
        animation: "orbit-pulse 3s ease-in-out 2s infinite",
      }}
    />

    {/* Glow backdrop */}
    <span
      className="absolute inset-0 rounded-full"
      style={{
        background:
          "radial-gradient(circle, rgba(13,148,136,0.4) 0%, rgba(13,148,136,0.1) 60%, transparent 100%)",
        filter: "blur(12px)",
      }}
    />

    {/* Main circle */}
    <span
      className="absolute inset-0 rounded-full"
      style={{
        background: "radial-gradient(circle at 35% 35%, #0f766e, #042f2e)",
        boxShadow:
          "0 0 30px rgba(13,148,136,0.6), 0 0 60px rgba(13,148,136,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
        border: "1px solid rgba(20,184,166,0.4)",
      }}
    />

    {/* Ping rings */}
    <span className="absolute inset-3 rounded-full bg-teal-500/20 animate-ping" />
    <span
      className="absolute inset-5 rounded-full bg-teal-400/15 animate-ping"
      style={{ animationDelay: "0.7s" }}
    />

    {/* Content */}
    <span
      className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full text-teal-300 text-xs font-bold"
      style={{
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.15)",
        backdropFilter: "blur(4px)",
      }}
    >
      🌍
    </span>
    <p className="relative z-10 mt-2 text-xs font-semibold text-teal-100 text-center px-2 leading-tight tracking-wide">
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

import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'

type HubNodeData = { label: string }
type HubNodeType = Node<HubNodeData, 'hub'>

export const HubNode = ({ data }: NodeProps<HubNodeType>) => (
  <div className="relative flex flex-col items-center justify-center w-36 h-36 rounded-full bg-teal-600 shadow-2xl">
    {/* Pulse rings */}
    <span className="absolute inset-0 rounded-full bg-teal-500 opacity-30 animate-ping" />
    <span className="absolute inset-2 rounded-full bg-teal-500 opacity-20 animate-ping [animation-delay:0.5s]" />

    {/* Content */}
    <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-teal-700 text-sm font-bold shadow">
      CBS
    </span>
    <p className="relative z-10 mt-2 text-xs font-medium text-white text-center px-2 leading-tight">
      {data.label}
    </p>

    {/* Source handles (one per side — React Flow auto-routes edges) */}
    <Handle type="source" position={Position.Top}    id="top"    style={{ opacity: 0 }} />
    <Handle type="source" position={Position.Right}  id="right"  style={{ opacity: 0 }} />
    <Handle type="source" position={Position.Bottom} id="bottom" style={{ opacity: 0 }} />
    <Handle type="source" position={Position.Left}   id="left"   style={{ opacity: 0 }} />
  </div>
)

import {
  Handle,
  NodeToolbar,
  Position,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { Landmark, Ruler, Users, GitMerge } from "lucide-react";

type CountryDetail = {
  flag: string;
  capital: string;
  area: number | undefined;
  borders: number;
  population: string;
};

type DimensionNodeData = {
  label: string;
  value: string;
  isNegative: boolean;
  isSelected?: boolean;
  detail?: CountryDetail;
};
type DimensionNodeType = Node<DimensionNodeData, "dimension">;

export const DimensionNode = ({ data }: NodeProps<DimensionNodeType>) => {
  const { label, value, isNegative, isSelected = false, detail } = data;
  const accent = isSelected ? "#ff0071" : isNegative ? "#ef4444" : "#6b7280";

  return (
    <>
      {detail && (
        <NodeToolbar isVisible={isSelected} position={Position.Top} offset={8}>
          <div
            className="flex items-center gap-3 px-3 py-2 rounded-lg"
            style={{
              background: "#fff",
              border: "1px solid #e2e2e2",
              boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
              fontFamily: "Inter, system-ui, sans-serif",
              whiteSpace: "nowrap",
            }}
          >
            <span className="text-2xl leading-none">{detail.flag}</span>
            {detail.capital && (
              <span
                className="flex items-center gap-1 text-xs"
                style={{ color: "#6b7280" }}
              >
                <Landmark className="h-3 w-3" style={{ color: "#ff0071" }} />
                <span style={{ color: "#1a1a1a" }}>{detail.capital}</span>
              </span>
            )}
            {detail.area !== undefined && (
              <span
                className="flex items-center gap-1 text-xs"
                style={{ color: "#6b7280" }}
              >
                <Ruler className="h-3 w-3" style={{ color: "#ff0071" }} />
                <span style={{ color: "#1a1a1a" }}>
                  {detail.area.toLocaleString()} km²
                </span>
              </span>
            )}
            <span
              className="flex items-center gap-1 text-xs"
              style={{ color: "#6b7280" }}
            >
              <Users className="h-3 w-3" style={{ color: "#ff0071" }} />
              <span style={{ color: "#1a1a1a" }}>{detail.population}</span>
            </span>
            <span
              className="flex items-center gap-1 text-xs"
              style={{ color: "#6b7280" }}
            >
              <GitMerge className="h-3 w-3" style={{ color: "#ff0071" }} />
              <span style={{ color: "#1a1a1a" }}>{detail.borders} borders</span>
            </span>
          </div>
        </NodeToolbar>
      )}

      <div
        className="flex flex-col items-center w-36 px-4 py-3 cursor-pointer"
        style={{
          background: "#fff",
          border: `1px solid ${isSelected ? "#ff0071" : "#e2e2e2"}`,
          borderRadius: 6,
          boxShadow: isSelected
            ? "0 0 0 3px rgba(255,0,113,0.12), 0 2px 8px rgba(0,0,0,0.08)"
            : "0 1px 4px rgba(0,0,0,0.06)",
          transform: isSelected ? "scale(1.05)" : "scale(1)",
          transition: "box-shadow 0.15s, transform 0.15s, border-color 0.15s",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
        onMouseEnter={(e) => {
          if (!isSelected)
            (e.currentTarget as HTMLDivElement).style.boxShadow =
              "0 1px 4px 1px rgba(0,0,0,0.12)";
        }}
        onMouseLeave={(e) => {
          if (!isSelected)
            (e.currentTarget as HTMLDivElement).style.boxShadow =
              "0 1px 4px rgba(0,0,0,0.06)";
        }}
        aria-label={`${label}: ${value}`}
      >
        <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
        <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
        <Handle
          type="target"
          position={Position.Right}
          style={{ opacity: 0 }}
        />

        <p
          className="text-xs font-medium truncate w-full text-center"
          style={{ color: accent }}
        >
          {label}
        </p>
        <p
          className="mt-1 text-xl font-bold"
          style={{
            color: isSelected ? "#ff0071" : isNegative ? "#ef4444" : "#1a1a1a",
          }}
        >
          {value}
        </p>
      </div>
    </>
  );
};

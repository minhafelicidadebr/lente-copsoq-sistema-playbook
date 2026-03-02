import { memo } from "react";
import { getBezierPath, type EdgeProps } from "reactflow";

interface CustomEdgeData {
  relation: "enables" | "tradeoff" | "conflicts_with";
  weight: number;
  rationale_short: string;
}

const EDGE_STYLES: Record<string, { stroke: string; dashArray: string; animated: boolean }> = {
  enables: { stroke: "hsl(var(--primary))", dashArray: "0", animated: true },
  tradeoff: { stroke: "hsl(var(--copsoq-prevencao))", dashArray: "6 4", animated: false },
  conflicts_with: { stroke: "hsl(var(--copsoq-pathos))", dashArray: "8 4", animated: false },
};

function getWidth(weight: number): number {
  if (weight >= 0.8) return 3;
  if (weight >= 0.5) return 2;
  return 1.5;
}

function CustomEdge({
  id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data, markerEnd,
}: EdgeProps<CustomEdgeData>) {
  const style = EDGE_STYLES[data?.relation || "enables"];
  const width = getWidth(data?.weight || 0.5);

  const [edgePath] = getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition });

  return (
    <g className="group cursor-pointer">
      {/* Invisible wider hit area */}
      <path d={edgePath} fill="none" stroke="transparent" strokeWidth={12} />
      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke={style.stroke}
        strokeWidth={width}
        strokeDasharray={style.dashArray}
        markerEnd={markerEnd}
        className="transition-all duration-200 group-hover:opacity-80"
      />
      {style.animated && (
        <circle r={2.5} fill={style.stroke}>
          <animateMotion dur="3s" repeatCount="indefinite" path={edgePath} />
        </circle>
      )}
    </g>
  );
}

export const EnablesEdge = memo(CustomEdge);
export const TradeoffEdge = memo(CustomEdge);

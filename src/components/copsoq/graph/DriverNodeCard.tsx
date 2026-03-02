import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { cn } from "@/lib/utils";
import { TIERS, type TierKey } from "./graphData";

interface DriverNodeData {
  slug: string;
  label: string;
  tier: TierKey;
  definition_short: string;
  selected?: boolean;
}

function DriverNodeCard({ data, selected }: NodeProps<DriverNodeData>) {
  const tierInfo = TIERS[data.tier] || TIERS.tier_0_foundation;

  return (
    <>
      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-muted-foreground !border-background" />
      <div
        className={cn(
          "group relative px-4 py-3 rounded-xl border-2 bg-card text-card-foreground shadow-card min-w-[140px] max-w-[180px] transition-all duration-200 cursor-pointer",
          selected
            ? "border-primary ring-2 ring-primary/20 shadow-card-hover scale-105"
            : "border-border hover:border-primary/50 hover:shadow-card-hover hover:scale-[1.02]"
        )}
      >
        {/* Tier badge */}
        <span
          className="absolute -top-2.5 left-3 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{ backgroundColor: tierInfo.color, color: "hsl(var(--primary-foreground))" }}
        >
          DRIVER
        </span>
        <p className="text-sm font-bold text-foreground mt-1 leading-tight">{data.label}</p>
        <p className="text-[10px] text-muted-foreground mt-1 leading-snug line-clamp-2">
          {data.definition_short}
        </p>
      </div>
      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-muted-foreground !border-background" />
    </>
  );
}

export default memo(DriverNodeCard);

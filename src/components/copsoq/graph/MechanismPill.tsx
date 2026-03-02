import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { cn } from "@/lib/utils";

interface MechanismNodeData {
  label: string;
  definition_short: string;
  selected?: boolean;
}

function MechanismPill({ data, selected }: NodeProps<MechanismNodeData>) {
  return (
    <>
      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-muted-foreground !border-background" />
      <div
        className={cn(
          "group relative px-4 py-2.5 rounded-full border bg-secondary text-secondary-foreground shadow-sm min-w-[120px] max-w-[170px] transition-all duration-200 cursor-pointer text-center",
          selected
            ? "border-accent ring-2 ring-accent/20 shadow-card-hover"
            : "border-border hover:border-accent/50 hover:shadow-card-hover"
        )}
      >
        <span className="absolute -top-2 left-3 text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
          MECANISMO
        </span>
        <p className="text-xs font-semibold text-foreground mt-0.5 leading-tight">{data.label}</p>
      </div>
      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-muted-foreground !border-background" />
    </>
  );
}

export default memo(MechanismPill);

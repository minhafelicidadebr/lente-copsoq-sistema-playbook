import { X, Zap, AlertTriangle, ArrowRight } from "lucide-react";
import { type DriverData, type MechanismData, isDriver } from "./graphData";

interface GraphTooltipProps {
  nodeId: string;
  data: DriverData | MechanismData;
  position: { x: number; y: number };
  onClose: () => void;
  onOpenPopout: () => void;
}

export default function GraphTooltip({ data, onClose, onOpenPopout }: GraphTooltipProps) {
  const driver = "quick_wins" in data ? (data as DriverData) : null;

  return (
    <div className="absolute z-50 w-72 rounded-xl border border-border bg-card text-card-foreground shadow-card-hover p-4 animate-scale-in">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Fechar tooltip"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
        {driver ? "Driver" : "Mecanismo"}
      </p>
      <p className="text-sm font-semibold text-foreground">{data.label || (data as any).slug}</p>
      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{data.definition_short}</p>

      <div className="mt-3 space-y-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Papel no sistema</p>
          <p className="text-xs text-foreground">{data.system_role}</p>
        </div>

        {driver && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
              <Zap className="h-3 w-3 text-accent" /> Quick Wins
            </p>
            <ul className="text-xs text-foreground space-y-0.5 mt-0.5">
              {driver.quick_wins.slice(0, 2).map((qw, i) => (
                <li key={i} className="flex items-start gap-1">
                  <span className="text-primary mt-0.5">•</span> {qw}
                </li>
              ))}
            </ul>
          </div>
        )}

        {driver && driver.failure_modes.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-copsoq-pathos" /> Riscos
            </p>
            <p className="text-xs text-foreground">{driver.failure_modes[0]}</p>
          </div>
        )}
      </div>

      <button
        onClick={onOpenPopout}
        className="mt-3 w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg py-2 transition-colors"
      >
        Abrir orientação completa <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  );
}

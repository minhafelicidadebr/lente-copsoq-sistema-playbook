import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, BarChart3, DollarSign, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConversionRailProps {
  onOpenDemo: () => void;
  onOpenForm: () => void;
  onNavigate: (id: string) => void;
}

export default function ConversionRail({ onOpenDemo, onOpenForm, onNavigate }: ConversionRailProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.5 }}
      className="fixed bottom-6 right-6 z-40 hidden lg:flex flex-col gap-2 items-end"
    >
      <button onClick={() => setDismissed(true)} className="text-muted-foreground hover:text-foreground text-xs mb-1">
        <X size={14} />
      </button>
      <Button onClick={onOpenForm} size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg gap-2">
        <Calendar size={14} /> Agendar demo
      </Button>
      <Button onClick={() => window.location.href = "/copsoq/q1/results/overview"} size="sm" variant="outline" className="bg-[hsl(210_25%_8%/0.8)] backdrop-blur border-[hsl(210_20%_18%)] text-[hsl(210_20%_95%)] gap-2">
        <BarChart3 size={14} /> Dashboard
      </Button>
      <Button onClick={() => onNavigate("s16-simulador-preco")} size="sm" variant="outline" className="bg-[hsl(210_25%_8%/0.8)] backdrop-blur border-[hsl(210_20%_18%)] text-[hsl(210_20%_95%)] gap-2">
        <DollarSign size={14} /> Simular preço
      </Button>
    </motion.div>
  );
}

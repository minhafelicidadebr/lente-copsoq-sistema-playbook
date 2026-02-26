import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { id: "s01-hero", label: "Início" },
  { id: "s03-tese", label: "Método" },
  { id: "s05-mensurar", label: "Mensurar" },
  { id: "s08-educar", label: "Educar" },
  { id: "s09-transformar", label: "Transformar" },
  { id: "s10-evoluir", label: "Evoluir" },
  { id: "s13-implantacao", label: "Implantação" },
  { id: "s15-demo-dashboard", label: "Demo" },
  { id: "s16-simulador-preco", label: "Preço" },
];

const TOTAL_SLIDES = 17;

interface DeckNavProps {
  currentSlide: number;
  onNavigate: (slideId: string) => void;
}

export default function DeckNav({ currentSlide, onNavigate }: DeckNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const progress = ((currentSlide + 1) / TOTAL_SLIDES) * 100;

  return (
    <>
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted/30">
        <motion.div
          className="h-full bg-accent"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Desktop nav */}
      <nav className="fixed top-1 left-0 right-0 z-50 hidden lg:flex items-center justify-center py-2">
        <div className="flex items-center gap-1 bg-[hsl(210_25%_8%/0.85)] backdrop-blur-xl border border-[hsl(210_20%_18%)] rounded-full px-4 py-2">
          <span className="text-xs font-bold text-accent mr-3 tracking-wider">MTR-F</span>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "px-3 py-1.5 text-[11px] font-medium rounded-full transition-all",
                "text-[hsl(210_20%_70%)] hover:text-[hsl(210_20%_95%)] hover:bg-[hsl(210_20%_18%)]"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 right-4 z-50 lg:hidden p-2 rounded-full bg-[hsl(210_25%_8%/0.85)] backdrop-blur-xl border border-[hsl(210_20%_18%)] text-[hsl(210_20%_95%)]"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="fixed inset-y-0 right-0 z-40 w-64 bg-[hsl(210_25%_8%/0.95)] backdrop-blur-xl border-l border-[hsl(210_20%_18%)] pt-16 px-4 lg:hidden"
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); setMobileOpen(false); }}
              className="block w-full text-left px-4 py-3 text-sm text-[hsl(210_20%_70%)] hover:text-[hsl(210_20%_95%)] hover:bg-[hsl(210_20%_18%)] rounded-lg transition-all"
            >
              {item.label}
            </button>
          ))}
        </motion.div>
      )}
    </>
  );
}

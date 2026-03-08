import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { RotateCcw, ChevronLeft, ChevronRight, CheckCircle2, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Flashcard } from "@/lib/copsoq/learningTrails";

interface FlashcardDeckProps {
  cards: Flashcard[];
  onComplete?: () => void;
}

export default function FlashcardDeck({ cards, onComplete }: FlashcardDeckProps) {
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewed, setReviewed] = useState<Set<string>>(new Set());

  const card = cards[current];
  const progress = (reviewed.size / cards.length) * 100;

  const handleFlip = useCallback(() => setFlipped((f) => !f), []);

  const handleNext = () => {
    setReviewed((prev) => new Set(prev).add(card.id));
    setFlipped(false);
    if (current < cards.length - 1) {
      setCurrent((c) => c + 1);
    } else if (reviewed.size + 1 >= cards.length) {
      onComplete?.();
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      setFlipped(false);
      setCurrent((c) => c - 1);
    }
  };

  const handleReset = () => {
    setCurrent(0);
    setFlipped(false);
    setReviewed(new Set());
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">
            {current + 1} / {cards.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-[10px] gap-1">
            <CheckCircle2 className="h-3 w-3" /> {reviewed.size} revisados
          </Badge>
          <button onClick={handleReset} className="p-1 rounded hover:bg-muted transition-colors" aria-label="Reiniciar">
            <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <Progress value={progress} className="h-1" />

      {/* Card */}
      <div
        className="perspective-1000 cursor-pointer min-h-[220px]"
        onClick={handleFlip}
        onKeyDown={(e) => e.key === " " && handleFlip()}
        tabIndex={0}
        role="button"
        aria-label={flipped ? "Mostrando resposta. Clique para ver pergunta." : "Mostrando pergunta. Clique para ver resposta."}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 30 }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative w-full min-h-[220px]"
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-xl border border-border bg-card p-6 flex flex-col items-center justify-center text-center shadow-card"
            style={{ backfaceVisibility: "hidden" }}
          >
            <span className="text-xs text-primary font-medium mb-3 uppercase tracking-wider">Pergunta</span>
            <p className="text-lg font-semibold text-foreground leading-relaxed">{card.front}</p>
            <span className="text-xs text-muted-foreground mt-4">Toque para virar →</span>
          </div>
          {/* Back */}
          <div
            className="absolute inset-0 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 p-6 flex flex-col items-center justify-center text-center shadow-card-hover"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <span className="text-xs text-[hsl(var(--copsoq-salus))] font-medium mb-3 uppercase tracking-wider">Resposta</span>
            <p className="text-sm text-foreground leading-relaxed">{card.back}</p>
            <div className="flex gap-1.5 mt-4">
              {card.tags.map((t) => (
                <Badge key={t} variant="outline" className="text-[9px]">{t}</Badge>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-1">
        <Button variant="ghost" size="sm" onClick={handlePrev} disabled={current === 0} className="gap-1">
          <ChevronLeft className="h-4 w-4" /> Anterior
        </Button>
        <Button size="sm" onClick={handleNext} className="gap-1">
          {current < cards.length - 1 ? (
            <>Próximo <ChevronRight className="h-4 w-4" /></>
          ) : (
            <>Concluir <CheckCircle2 className="h-4 w-4" /></>
          )}
        </Button>
      </div>
    </div>
  );
}

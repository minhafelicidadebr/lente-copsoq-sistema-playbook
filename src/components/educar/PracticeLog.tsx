import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, CheckCircle2, Pencil, Eye, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import type { PracticeChallenge } from "@/lib/copsoq/learningTrails";

interface PracticeLogProps {
  practices: PracticeChallenge[];
  onComplete?: (id: string, notes: string) => void;
}

const TYPE_ICON = { reflection: Pencil, action: Target, observation: Eye };
const TYPE_LABEL = { reflection: "Reflexão", action: "Ação", observation: "Observação" };

export default function PracticeLog({ practices, onComplete }: PracticeLogProps) {
  const [completed, setCompleted] = useState<Record<string, string>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const handleSubmit = (p: PracticeChallenge) => {
    setCompleted((prev) => ({ ...prev, [p.id]: note }));
    onComplete?.(p.id, note);
    setActiveId(null);
    setNote("");
  };

  const totalXP = practices.filter((p) => completed[p.id] !== undefined).reduce((s, p) => s + p.xpReward, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" /> Práticas Guiadas
        </h4>
        {totalXP > 0 && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <Badge className="bg-[hsl(var(--accent))] text-accent-foreground gap-1">
              <Zap className="h-3 w-3" /> +{totalXP} XP
            </Badge>
          </motion.div>
        )}
      </div>

      <div className="space-y-3">
        {practices.map((p, i) => {
          const Icon = TYPE_ICON[p.type];
          const isDone = completed[p.id] !== undefined;
          const isActive = activeId === p.id;

          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-lg border p-4 transition-all duration-300 ${
                isDone
                  ? "border-[hsl(var(--copsoq-salus)/0.3)] bg-[hsl(var(--copsoq-salus)/0.03)]"
                  : "border-border bg-card hover:shadow-card"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isDone ? "bg-[hsl(var(--copsoq-salus)/0.15)]" : "bg-primary/10"
                }`}>
                  {isDone ? (
                    <CheckCircle2 className="h-4 w-4 text-[hsl(var(--copsoq-salus))]" />
                  ) : (
                    <Icon className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="text-sm font-semibold text-foreground">{p.title}</h5>
                    <Badge variant="outline" className="text-[9px] capitalize">{TYPE_LABEL[p.type]}</Badge>
                    <Badge variant="secondary" className="text-[9px] gap-0.5 ml-auto">
                      <Star className="h-2.5 w-2.5" /> +{p.xpReward} XP
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{p.description}</p>

                  <AnimatePresence>
                    {isActive && !isDone && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 space-y-2">
                          <Textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Registre sua experiência, reflexão ou aprendizado..."
                            className="text-xs min-h-[80px] bg-background"
                          />
                          <div className="flex gap-2 justify-end">
                            <Button variant="ghost" size="sm" onClick={() => { setActiveId(null); setNote(""); }}>
                              Cancelar
                            </Button>
                            <Button size="sm" onClick={() => handleSubmit(p)} disabled={!note.trim()} className="gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Registrar
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!isDone && !isActive && (
                    <Button variant="ghost" size="sm" className="mt-2 text-xs h-7" onClick={() => setActiveId(p.id)}>
                      Iniciar prática →
                    </Button>
                  )}
                  {isDone && (
                    <p className="text-xs text-[hsl(var(--copsoq-salus))] mt-2 italic">✓ Registrado: "{completed[p.id]?.slice(0, 80)}..."</p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ChevronRight, RotateCcw, Trophy, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { QuizQuestion } from "@/lib/copsoq/learningTrails";

interface QuizEngineProps {
  questions: QuizQuestion[];
  onComplete?: (score: number, total: number) => void;
}

export default function QuizEngine({ questions, onComplete }: QuizEngineProps) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[current];
  const isCorrect = selected === q?.correctIndex;
  const progress = ((current + (confirmed ? 1 : 0)) / questions.length) * 100;

  const handleConfirm = () => {
    if (selected === null) return;
    setConfirmed(true);
    if (selected === q.correctIndex) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setConfirmed(false);
    } else {
      setFinished(true);
      onComplete?.(score + (isCorrect ? 0 : 0), questions.length);
    }
  };

  const handleReset = () => {
    setCurrent(0);
    setSelected(null);
    setConfirmed(false);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8 space-y-4">
        <motion.div
          initial={{ rotate: -180, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <Trophy className={`h-16 w-16 mx-auto ${pct >= 70 ? "text-[hsl(var(--accent))]" : "text-muted-foreground"}`} />
        </motion.div>
        <h3 className="text-xl font-bold text-foreground">
          {pct >= 70 ? "Excelente! 🎉" : pct >= 50 ? "Bom trabalho! 👏" : "Continue praticando! 💪"}
        </h3>
        <p className="text-3xl font-bold text-gradient-primary">{score}/{questions.length}</p>
        <p className="text-sm text-muted-foreground">Acertou {pct}% das questões</p>
        <Progress value={pct} className="h-2 max-w-xs mx-auto" />
        <div className="flex gap-3 justify-center pt-2">
          <Button variant="outline" onClick={handleReset} className="gap-1.5">
            <RotateCcw className="h-4 w-4" /> Tentar novamente
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-muted-foreground">
          {current + 1} / {questions.length}
        </span>
        <Progress value={progress} className="h-1.5 flex-1" />
        <span className="text-xs font-medium text-primary">{Math.round(progress)}%</span>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -30, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Card className="border-border shadow-card">
            <CardContent className="p-6 space-y-5">
              <h4 className="text-base font-semibold text-foreground leading-relaxed">{q.question}</h4>

              <div className="space-y-2.5">
                {q.options.map((opt, i) => {
                  let borderClass = "border-border hover:border-primary/50 hover:bg-primary/5";
                  if (confirmed && i === q.correctIndex) borderClass = "border-[hsl(var(--copsoq-salus))] bg-[hsl(var(--copsoq-salus)/0.08)]";
                  else if (confirmed && i === selected && !isCorrect) borderClass = "border-[hsl(var(--copsoq-pathos))] bg-[hsl(var(--copsoq-pathos)/0.08)]";
                  else if (!confirmed && i === selected) borderClass = "border-primary bg-primary/5 ring-1 ring-primary/20";

                  return (
                    <motion.button
                      key={i}
                      whileTap={!confirmed ? { scale: 0.98 } : {}}
                      onClick={() => !confirmed && setSelected(i)}
                      disabled={confirmed}
                      className={`w-full text-left p-3.5 rounded-lg border transition-all duration-200 flex items-center gap-3 ${borderClass} ${
                        confirmed ? "cursor-default" : "cursor-pointer"
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        !confirmed && i === selected ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground"
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-sm text-foreground flex-1">{opt}</span>
                      {confirmed && i === q.correctIndex && <CheckCircle2 className="h-5 w-5 text-[hsl(var(--copsoq-salus))] flex-shrink-0" />}
                      {confirmed && i === selected && !isCorrect && i !== q.correctIndex && <XCircle className="h-5 w-5 text-[hsl(var(--copsoq-pathos))] flex-shrink-0" />}
                    </motion.button>
                  );
                })}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {confirmed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className={`p-3.5 rounded-lg flex gap-2.5 ${
                      isCorrect ? "bg-[hsl(var(--copsoq-salus)/0.08)]" : "bg-[hsl(var(--copsoq-prevencao)/0.08)]"
                    }`}>
                      <Lightbulb className="h-4 w-4 flex-shrink-0 mt-0.5 text-[hsl(var(--accent))]" />
                      <p className="text-xs text-foreground leading-relaxed">{q.explanation}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="flex justify-end">
                {!confirmed ? (
                  <Button onClick={handleConfirm} disabled={selected === null} className="gap-1.5">
                    Confirmar
                  </Button>
                ) : (
                  <Button onClick={handleNext} className="gap-1.5">
                    {current < questions.length - 1 ? (
                      <>Próxima <ChevronRight className="h-4 w-4" /></>
                    ) : (
                      <>Ver resultado <Trophy className="h-4 w-4" /></>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

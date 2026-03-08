import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, BookOpen, Brain, Target, Sparkles, Play, Lock, ChevronRight, Award, Clock, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { COLLABORATOR_MODULES, MANAGER_MODULES, type LearningModule } from "@/lib/copsoq/learningTrails";
import IFTWallet from "@/components/educar/IFTWallet";
import ModuleView from "@/components/educar/ModuleView";
import { useAuth } from "@/lib/auth/context";

const DIDACTICS = [
  { icon: "🎬", label: "Microlearning", desc: "Vídeos curtos com legendas em PT" },
  { icon: "🧠", label: "Spaced Repetition", desc: "Flashcards com repetição espaçada" },
  { icon: "❓", label: "Quiz Adaptativo", desc: "Teste de compreensão com feedback" },
  { icon: "🎯", label: "Prática Guiada", desc: "Desafios no mundo real" },
  { icon: "👥", label: "Aprendizagem Social", desc: "Buddy system & compartilhamento" },
  { icon: "📋", label: "Evidências de Transferência", desc: "Registre aplicação prática" },
];

export default function EducarTrilhas() {
  const { user } = useAuth();
  const [activeModule, setActiveModule] = useState<LearningModule | null>(null);
  const [tab, setTab] = useState<"colaborador" | "gestor">("colaborador");
  const [xp, setXp] = useState(() => {
    const stored = localStorage.getItem("ift_xp");
    return stored ? parseInt(stored, 10) : 0;
  });

  const role = user?.role;
  const showManagerTab = role === "ADMIN" || role === "GESTOR_BEM_ESTAR" || role === "GESTOR_COMPLIANCE" || role === "COORDENADOR_GERENTE";

  const modules = useMemo(() => (tab === "colaborador" ? COLLABORATOR_MODULES : MANAGER_MODULES), [tab]);

  if (activeModule) {
    return (
      <ModuleView
        module={activeModule}
        onBack={() => setActiveModule(null)}
      />
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl gradient-hero p-8 text-primary-foreground">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <GraduationCap className="h-8 w-8" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold">Educar — Trilhas de Aprendizagem</h1>
              <p className="text-sm opacity-80">Formação baseada em ciência para o florescimento no trabalho</p>
            </div>
          </div>
          <p className="text-xs opacity-70 max-w-xl leading-relaxed">
            Trilhas nascem do diagnóstico COPSOQ. Cada módulo é ativado por faixas de risco detectadas.
            Conteúdo baseado na Ciência do Bem-Estar (Yale) e no Work Wellbeing Playbook (12 drivers).
          </p>
        </div>
        {/* Decorative */}
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-primary-foreground/5 blur-2xl" />
        <div className="absolute -left-4 -bottom-4 w-32 h-32 rounded-full bg-accent/10 blur-xl" />
      </div>

      {/* IFT Wallet */}
      <IFTWallet xp={xp} streak={3} badges={xp > 100 ? ["Fundação"] : []} level={Math.floor(xp / 200) + 1} />

      {/* Didactics grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {DIDACTICS.map((d, i) => (
          <motion.div
            key={d.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-border bg-card p-3 text-center hover:shadow-card transition-shadow"
          >
            <span className="text-2xl block mb-1">{d.icon}</span>
            <p className="text-xs font-semibold text-foreground">{d.label}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{d.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Tab selector */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as "colaborador" | "gestor")}>
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="colaborador" className="flex-1 gap-1 text-xs">
            <BookOpen className="h-3.5 w-3.5" /> Ciência da Felicidade
          </TabsTrigger>
          {showManagerTab && (
            <TabsTrigger value="gestor" className="flex-1 gap-1 text-xs">
              <Target className="h-3.5 w-3.5" /> 12 Drivers (Gestores)
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="colaborador" className="mt-6">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[hsl(var(--cycle-educar))]" />
              Ciência das Emoções — Laurie Santos (Yale)
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              5 módulos baseados no curso "The Science of Well-Being" + TED Talks selecionados. Legendas em português.
            </p>
          </div>
          <ModuleGrid modules={COLLABORATOR_MODULES} onSelect={setActiveModule} />
        </TabsContent>

        {showManagerTab && (
          <TabsContent value="gestor" className="mt-6">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Work Wellbeing Playbook — Trilha do Gestor
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                4 módulos baseados no modelo de 12 drivers (Oxford/WWM). Sequência: Fundação → Redução de Dano → Coesão → Cultura.
              </p>
            </div>
            <ModuleGrid modules={MANAGER_MODULES} onSelect={setActiveModule} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

function ModuleGrid({ modules, onSelect }: { modules: LearningModule[]; onSelect: (m: LearningModule) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {modules.map((m, i) => {
        const locked = i > 0 && !!m.unlockCondition;
        return (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card
              className={`group cursor-pointer border transition-all duration-300 overflow-hidden ${
                locked
                  ? "opacity-60 border-border"
                  : "border-border hover:border-primary/40 hover:shadow-card-hover"
              }`}
              onClick={() => !locked && onSelect(m)}
            >
              {/* Color stripe */}
              <div className={`h-1.5 w-full bg-[hsl(var(--${m.color}))]`} />
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{m.icon}</span>
                    <div>
                      <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        {m.title}
                      </h3>
                      <p className="text-[10px] text-muted-foreground">{m.subtitle}</p>
                    </div>
                  </div>
                  {locked ? (
                    <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                  )}
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2">{m.description}</p>

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-[9px] gap-0.5">
                    <Play className="h-2.5 w-2.5" /> {m.videos.length} vídeos
                  </Badge>
                  <Badge variant="secondary" className="text-[9px] gap-0.5">
                    <Brain className="h-2.5 w-2.5" /> {m.flashcards.length} flashcards
                  </Badge>
                  <Badge variant="secondary" className="text-[9px] gap-0.5">
                    <Clock className="h-2.5 w-2.5" /> ~{m.estimatedMinutes}min
                  </Badge>
                  <Badge variant="outline" className="text-[9px] gap-0.5 ml-auto">
                    <Zap className="h-2.5 w-2.5" /> +{m.xpReward} XP
                  </Badge>
                </div>

                {locked && m.unlockCondition && (
                  <p className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                    <Lock className="h-3 w-3" /> {m.unlockCondition}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

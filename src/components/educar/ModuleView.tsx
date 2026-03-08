import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Brain, HelpCircle, Target, BookOpen, Clock, Zap, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LearningModule } from "@/lib/copsoq/learningTrails";
import VideoLab from "./VideoLab";
import QuizEngine from "./QuizEngine";
import FlashcardDeck from "./FlashcardDeck";
import PracticeLog from "./PracticeLog";

interface ModuleViewProps {
  module: LearningModule;
  onBack: () => void;
  locked?: boolean;
}

export default function ModuleView({ module: m, onBack, locked = false }: ModuleViewProps) {
  const [completedVideos, setCompletedVideos] = useState<Set<string>>(new Set());
  const [quizDone, setQuizDone] = useState(false);
  const [flashcardsDone, setFlashcardsDone] = useState(false);
  const [practicesDone, setPracticesDone] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState("videos");

  const videoProgress = m.videos.length > 0 ? (completedVideos.size / m.videos.length) * 100 : 0;
  const practiceProgress = m.practices.length > 0 ? (practicesDone.size / m.practices.length) * 100 : 0;
  const totalSections = 4;
  const doneSections = [videoProgress >= 100, quizDone, flashcardsDone, practiceProgress >= 100].filter(Boolean).length;
  const overallProgress = (doneSections / totalSections) * 100;

  if (locked) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 space-y-4">
        <Lock className="h-12 w-12 mx-auto text-muted-foreground" />
        <h3 className="text-lg font-semibold text-foreground">Módulo Bloqueado</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">{m.unlockCondition || "Complete o módulo anterior para desbloquear."}</p>
        <Button variant="outline" onClick={onBack}>← Voltar</Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="mt-1 flex-shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-2xl">{m.icon}</span>
            <h2 className="text-xl font-bold text-foreground">{m.title}</h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{m.subtitle}</p>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{m.description}</p>
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <Badge variant="secondary" className="text-[10px] gap-1"><Clock className="h-3 w-3" /> ~{m.estimatedMinutes} min</Badge>
            <Badge variant="secondary" className="text-[10px] gap-1"><Zap className="h-3 w-3" /> +{m.xpReward} XP</Badge>
            <Badge variant="outline" className="text-[10px] gap-1"><BookOpen className="h-3 w-3" /> {m.videos.length} vídeos</Badge>
          </div>
        </div>
      </div>

      {/* Overall progress */}
      <div className="rounded-lg bg-muted/50 p-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-muted-foreground">Progresso do módulo</span>
          <span className="text-xs font-bold text-primary">{Math.round(overallProgress)}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-primary to-[hsl(var(--accent))]"
          />
        </div>
        <div className="flex gap-3 mt-2 text-[10px] text-muted-foreground">
          <span className={videoProgress >= 100 ? "text-[hsl(var(--copsoq-salus))]" : ""}>🎬 Vídeos {Math.round(videoProgress)}%</span>
          <span className={quizDone ? "text-[hsl(var(--copsoq-salus))]" : ""}>❓ Quiz {quizDone ? "✓" : "—"}</span>
          <span className={flashcardsDone ? "text-[hsl(var(--copsoq-salus))]" : ""}>🧠 Flashcards {flashcardsDone ? "✓" : "—"}</span>
          <span className={practiceProgress >= 100 ? "text-[hsl(var(--copsoq-salus))]" : ""}>🎯 Prática {Math.round(practiceProgress)}%</span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-4 h-auto">
          <TabsTrigger value="videos" className="gap-1 text-xs py-2">
            <Play className="h-3.5 w-3.5" /> VideoLab
          </TabsTrigger>
          <TabsTrigger value="quiz" className="gap-1 text-xs py-2">
            <HelpCircle className="h-3.5 w-3.5" /> Quiz
          </TabsTrigger>
          <TabsTrigger value="flashcards" className="gap-1 text-xs py-2">
            <Brain className="h-3.5 w-3.5" /> Flashcards
          </TabsTrigger>
          <TabsTrigger value="practice" className="gap-1 text-xs py-2">
            <Target className="h-3.5 w-3.5" /> Prática
          </TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {m.videos.map((v, i) => (
              <VideoLab
                key={v.id}
                video={v}
                index={i}
                completed={completedVideos.has(v.id)}
                onComplete={(id) => setCompletedVideos((prev) => new Set(prev).add(id))}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="quiz" className="mt-4 max-w-2xl">
          {m.quiz.length > 0 ? (
            <QuizEngine
              questions={m.quiz}
              onComplete={() => setQuizDone(true)}
            />
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">Quiz em construção para este módulo.</p>
          )}
        </TabsContent>

        <TabsContent value="flashcards" className="mt-4 max-w-lg mx-auto">
          {m.flashcards.length > 0 ? (
            <FlashcardDeck
              cards={m.flashcards}
              onComplete={() => setFlashcardsDone(true)}
            />
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">Flashcards em construção.</p>
          )}
        </TabsContent>

        <TabsContent value="practice" className="mt-4 max-w-2xl">
          <PracticeLog
            practices={m.practices}
            onComplete={(id) => setPracticesDone((prev) => new Set(prev).add(id))}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

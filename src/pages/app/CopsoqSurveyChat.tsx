import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Send, HelpCircle, Shield, Lock, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DIMENSIONS, LIKERT_SCALES, TOTAL_ITEMS, type CopsoqDimension, type LikertScale } from "@/lib/copsoq/dimensions";
import { computeResults, type SurveyResult } from "@/lib/copsoq/scoring";
import eliasAvatar from "@/assets/elias-avatar.png";

interface ChatMessage {
  id: string;
  role: "elias" | "user" | "system";
  content: string;
  actions?: ChatAction[];
  dimId?: string;
  likertScale?: LikertScale;
}

interface ChatAction {
  type: "badges" | "options" | "likert" | "link";
  items?: string[];
  likertScale?: LikertScale;
  dimId?: string;
  url?: string;
}

type SurveyPhase = "welcome" | "consent" | "survey" | "complete";

// Build a flat list of items from dimensions (using IDs only — R2)
function buildItemQueue(): Array<{ dimId: string; dim: CopsoqDimension; itemIndex: number }> {
  const queue: Array<{ dimId: string; dim: CopsoqDimension; itemIndex: number }> = [];
  for (const dim of DIMENSIONS) {
    for (let i = 0; i < dim.itemCount; i++) {
      queue.push({ dimId: dim.id, dim, itemIndex: i });
    }
  }
  return queue;
}

const ITEM_QUEUE = buildItemQueue();

const helpItems = [
  { q: "Isso vai me expor?", a: "Não. Resultados são agregados com célula mínima de 8 pessoas. Sem ranking." },
  { q: "Para que serve?", a: "Para orientar ações reais no trabalho, com base em evidência científica." },
  { q: "Posso parar?", a: "Sim. Você pode interromper a qualquer momento, sem prejuízo." },
  { q: "É obrigatório?", a: "A participação é voluntária e confidencial, conforme LGPD." },
];

export default function CopsoqSurveyChat() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<SurveyPhase>("welcome");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [currentItemIdx, setCurrentItemIdx] = useState(0);
  const [responses, setResponses] = useState<Record<string, number[]>>({});
  const [result, setResult] = useState<SurveyResult | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const progress = phase === "survey" ? Math.round((currentItemIdx / ITEM_QUEUE.length) * 100) : phase === "complete" ? 100 : 0;

  const addMessages = useCallback((...msgs: ChatMessage[]) => {
    setMessages((prev) => [...prev, ...msgs]);
  }, []);

  // Initialize welcome
  useEffect(() => {
    if (messages.length === 0) {
      addMessages({
        id: "welcome-1",
        role: "elias",
        content: "Olá! Eu sou o **EliAs** 🤖\n\nSou seu copiloto empático e vou te acompanhar no diagnóstico **COPSOQ III** — um instrumento validado cientificamente para entender como o trabalho está afetando sua energia, demandas, relações e segurança psicológica.\n\nSuas respostas são **100% confidenciais** e serão analisadas apenas de forma agregada.",
        actions: [
          { type: "badges", items: ["Sem ranking", "Sem exposição individual", "Células mínimas ≥8", "LGPD"] },
          { type: "options", items: ["✅ Sim, vamos começar", "❓ Quero entender antes"] },
        ],
      });
    }
  }, []);

  // Auto-scroll
  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, 100);
  }, [messages]);

  const askCurrentItem = useCallback(() => {
    if (currentItemIdx >= ITEM_QUEUE.length) {
      // Survey complete
      const result = computeResults(responses);
      setResult(result);
      setPhase("complete");
      localStorage.setItem("copsoq_result", JSON.stringify(result));
      localStorage.setItem("copsoq_responses", JSON.stringify(responses));
      addMessages({
        id: `complete`,
        role: "elias",
        content: `🎉 **Parabéns! Você completou o diagnóstico COPSOQ III!**\n\nSuas respostas foram registradas com segurança. Agora vou te mostrar um panorama dos seus resultados e recomendar trilhas de aprendizagem personalizadas.\n\n*Lembre-se: estes resultados são para seu autoconhecimento. O relatório organizacional usa apenas dados agregados.*`,
        actions: [
          { type: "link", items: ["📊 Ver meus resultados"], url: "/app/meus-resultados" },
        ],
      });
      return;
    }

    const item = ITEM_QUEUE[currentItemIdx];
    const isNewDimension = currentItemIdx === 0 || ITEM_QUEUE[currentItemIdx - 1].dimId !== item.dimId;

    if (isNewDimension) {
      addMessages(
        {
          id: `dim-intro-${item.dimId}`,
          role: "system",
          content: `📋 Dimensão: **${item.dim.name}**`,
        },
        {
          id: `item-${currentItemIdx}`,
          role: "elias",
          content: `Agora vamos avaliar **${item.dim.name}**.\n\nPergunta ${currentItemIdx + 1} de ${ITEM_QUEUE.length}:\n\n*[Item ${item.dimId}-${item.itemIndex + 1} — carregado via item bank server-side (R2)]*\n\nComo você classificaria?`,
          dimId: item.dimId,
          likertScale: item.dim.likertScale,
          actions: [{ type: "likert", likertScale: item.dim.likertScale, dimId: item.dimId }],
        }
      );
    } else {
      addMessages({
        id: `item-${currentItemIdx}`,
        role: "elias",
        content: `Pergunta ${currentItemIdx + 1} de ${ITEM_QUEUE.length}:\n\n*[Item ${item.dimId}-${item.itemIndex + 1} — item bank (R2)]*`,
        dimId: item.dimId,
        likertScale: item.dim.likertScale,
        actions: [{ type: "likert", likertScale: item.dim.likertScale, dimId: item.dimId }],
      });
    }
  }, [currentItemIdx, responses, addMessages]);

  const handleOption = (option: string) => {
    addMessages({ id: `user-${Date.now()}`, role: "user", content: option });

    if (option.includes("entender antes")) {
      addMessages({
        id: `explain-${Date.now()}`,
        role: "elias",
        content: "O **COPSOQ III** (Copenhagen Psychosocial Questionnaire) é um instrumento validado internacionalmente para avaliar riscos psicossociais no trabalho.\n\n📊 **O que avalia:** 26 dimensões agrupadas em 7 fatores\n🔒 **Privacidade:** dados individuais nunca são expostos\n⏱ **Duração:** ~15 minutos\n📈 **Resultado:** você recebe um panorama pessoal + trilhas de aprendizagem\n\nO ciclo completo:\n1️⃣ **Mensurar** — este diagnóstico\n2️⃣ **Educar** — trilhas baseadas nos seus resultados\n3️⃣ **Transformar** — intervenções priorizadas\n4️⃣ **Evoluir** — acompanhamento longitudinal",
        actions: [{ type: "options", items: ["✅ Entendi, vamos começar!"] }],
      });
    } else if (option.includes("começar")) {
      setPhase("consent");
      addMessages({
        id: `consent-${Date.now()}`,
        role: "elias",
        content: "Antes de iniciar, preciso do seu **consentimento informado**:\n\n🔐 Suas respostas serão analisadas **apenas de forma agregada**\n🚫 **Não haverá** ranking de pessoas ou equipes\n🛑 Você pode **interromper a qualquer momento**\n📋 Os dados seguem a política de privacidade (LGPD)\n⚠️ **Evite inserir dados pessoais sensíveis** nos campos livres\n\nAo prosseguir, você confirma que entendeu e concorda.",
        actions: [{ type: "options", items: ["🤝 Concordo e quero iniciar a pesquisa"] }],
      });
    } else if (option.includes("Concordo")) {
      setPhase("survey");
      addMessages({
        id: `start-${Date.now()}`,
        role: "elias",
        content: "Excelente! 🎯\n\nVamos começar! São **" + ITEM_QUEUE.length + " perguntas** organizadas por dimensão. Para cada uma, escolha a opção que melhor reflete sua experiência no trabalho.\n\n*Dica: responda com sinceridade, não existe certo ou errado.*",
      });
      setTimeout(() => askCurrentItem(), 500);
    }
  };

  const handleLikertResponse = (value: number, label: string, dimId: string) => {
    addMessages({ id: `user-likert-${Date.now()}`, role: "user", content: label });

    setResponses((prev) => {
      const existing = prev[dimId] || [];
      return { ...prev, [dimId]: [...existing, value] };
    });

    const nextIdx = currentItemIdx + 1;
    setCurrentItemIdx(nextIdx);

    // Feedback messages every ~10 items
    if (nextIdx > 0 && nextIdx % 10 === 0 && nextIdx < ITEM_QUEUE.length) {
      const pct = Math.round((nextIdx / ITEM_QUEUE.length) * 100);
      const encouragements = [
        `Ótimo progresso! Você já completou **${pct}%** 💪`,
        `Continuando bem! **${pct}%** concluído. Falta pouco! 🎯`,
        `Excelente! **${pct}%** respondido. Cada resposta conta! ⭐`,
      ];
      addMessages({
        id: `encourage-${nextIdx}`,
        role: "elias",
        content: encouragements[Math.floor(Math.random() * encouragements.length)],
      });
    }

    setTimeout(() => {
      if (nextIdx >= ITEM_QUEUE.length) {
        const result = computeResults({ ...responses, [dimId]: [...(responses[dimId] || []), value] });
        setResult(result);
        setPhase("complete");
        localStorage.setItem("copsoq_result", JSON.stringify(result));
        localStorage.setItem("copsoq_responses", JSON.stringify({ ...responses, [dimId]: [...(responses[dimId] || []), value] }));
        addMessages({
          id: `complete`,
          role: "elias",
          content: `🎉 **Parabéns! Você completou o diagnóstico COPSOQ III!**\n\nSuas ${ITEM_QUEUE.length} respostas foram registradas com segurança.\n\nAgora vou te mostrar um panorama dos seus resultados e recomendar trilhas de aprendizagem personalizadas pela **Ciência da Felicidade**.\n\n*Lembre-se: estes resultados são para seu autoconhecimento. O relatório organizacional usa apenas dados agregados (minCellSize ≥ 8).*`,
          actions: [
            { type: "options", items: ["📊 Ver meus resultados"] },
          ],
        });
      } else {
        // Ask next item
        const item = ITEM_QUEUE[nextIdx];
        const isNewDimension = ITEM_QUEUE[nextIdx - 1]?.dimId !== item.dimId;

        const msgs: ChatMessage[] = [];
        if (isNewDimension) {
          msgs.push({
            id: `dim-intro-${item.dimId}`,
            role: "system",
            content: `📋 Nova dimensão: **${item.dim.name}**`,
          });
        }
        msgs.push({
          id: `item-${nextIdx}`,
          role: "elias",
          content: isNewDimension
            ? `Agora vamos avaliar **${item.dim.name}**.\n\nPergunta ${nextIdx + 1} de ${ITEM_QUEUE.length}:\n\n*[Item ${item.dimId}-${item.itemIndex + 1} — item bank (R2)]*`
            : `Pergunta ${nextIdx + 1} de ${ITEM_QUEUE.length}:\n\n*[Item ${item.dimId}-${item.itemIndex + 1} — item bank (R2)]*`,
          dimId: item.dimId,
          likertScale: item.dim.likertScale,
          actions: [{ type: "likert", likertScale: item.dim.likertScale, dimId: item.dimId }],
        });
        addMessages(...msgs);
      }
    }, 300);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    addMessages({ id: `user-free-${Date.now()}`, role: "user", content: input });
    addMessages({
      id: `elias-free-${Date.now()}`,
      role: "elias",
      content: "Entendi! No momento estou focado em conduzir o diagnóstico. Se tiver dúvidas sobre privacidade ou metodologia, clique no **?** acima. ⚠️ *Evite inserir dados pessoais sensíveis.*",
    });
    setInput("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
        <div className="flex items-center gap-3">
          <motion.img
            src={eliasAvatar}
            alt="EliAs"
            className="h-10 w-10 rounded-full ring-2 ring-primary/30"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <div>
            <h1 className="text-lg font-bold text-foreground">EliAs — Diagnóstico COPSOQ III</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Lock className="h-3 w-3" /> Confidencial · Versão Padrão Brasileira (Bounassar, 2024)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader><SheetTitle>Perguntas Frequentes</SheetTitle></SheetHeader>
              <div className="mt-6 space-y-4">
                {helpItems.map((item) => (
                  <div key={item.q} className="space-y-1">
                    <p className="font-medium text-sm text-foreground">{item.q}</p>
                    <p className="text-sm text-muted-foreground">{item.a}</p>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Progress bar */}
      {phase === "survey" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-3 space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Progresso</span>
            <span className="font-medium">{currentItemIdx} / {ITEM_QUEUE.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </motion.div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 pr-2" ref={scrollRef}>
        <div className="space-y-3 pb-4">
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : msg.role === "system" ? "justify-center" : "justify-start"}`}
              >
                {msg.role === "elias" && (
                  <img src={eliasAvatar} alt="EliAs" className="h-7 w-7 rounded-full flex-shrink-0 mt-1" />
                )}

                {msg.role === "system" ? (
                  <Badge variant="secondary" className="text-xs py-1">
                    {msg.content.replace(/\*\*/g, "")}
                  </Badge>
                ) : (
                  <div className={`max-w-lg space-y-2 ${msg.role === "user" ? "items-end" : ""}`}>
                    <Card className={`px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground border-0"
                        : "bg-card border border-border"
                    }`}>
                      <p className="text-sm whitespace-pre-line leading-relaxed">
                        {msg.content.split(/(\*\*.*?\*\*)/).map((part, i) =>
                          part.startsWith("**") && part.endsWith("**")
                            ? <strong key={i}>{part.slice(2, -2)}</strong>
                            : part.startsWith("*") && part.endsWith("*")
                            ? <em key={i}>{part.slice(1, -1)}</em>
                            : part
                        )}
                      </p>
                    </Card>

                    {msg.actions?.map((action, j) => (
                      <div key={j} className="flex flex-wrap gap-2">
                        {action.type === "badges" &&
                          action.items?.map((b) => (
                            <Badge key={b} variant="secondary" className="text-xs gap-1">
                              <Shield className="h-3 w-3" /> {b}
                            </Badge>
                          ))}
                        {action.type === "options" &&
                          action.items?.map((o) => (
                            <Button
                              key={o}
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (o.includes("resultados")) {
                                  navigate("/app/meus-resultados");
                                } else {
                                  handleOption(o);
                                }
                              }}
                              className="text-xs gap-1"
                            >
                              {o} <ChevronRight className="h-3 w-3" />
                            </Button>
                          ))}
                        {action.type === "likert" && action.likertScale && action.dimId && (
                          <div className="flex flex-col gap-1.5 w-full">
                            {LIKERT_SCALES[action.likertScale].map((opt) => (
                              <Button
                                key={opt.value}
                                variant="outline"
                                size="sm"
                                onClick={() => handleLikertResponse(opt.value, opt.label, action.dimId!)}
                                className="justify-start text-xs h-auto py-2 px-3 hover:bg-primary/10 hover:border-primary transition-colors"
                              >
                                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-muted text-[10px] font-bold mr-2 flex-shrink-0">
                                  {opt.value}
                                </span>
                                {opt.label}
                              </Button>
                            ))}
                          </div>
                        )}
                        {action.type === "link" && action.url && action.items?.map((label) => (
                          <Button
                            key={label}
                            onClick={() => navigate(action.url!)}
                            className="text-xs gap-1"
                          >
                            {label} <ChevronRight className="h-3 w-3" />
                          </Button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border pt-3 mt-auto">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={phase === "survey" ? "Use os botões acima para responder..." : "Pergunte ao EliAs..."}
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon" variant="secondary">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1 text-center">
          ⚠️ Evite inserir dados pessoais sensíveis. Resultados agregados com minCellSize ≥ 8.
        </p>
      </div>
    </div>
  );
}

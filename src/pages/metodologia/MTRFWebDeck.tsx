import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck, ArrowRight, Activity, BookOpen, Wrench, TrendingUp,
  BarChart3, Zap, Target, Users, FileText, Calendar,
  ChevronRight, Lock, Eye, AlertTriangle, Play, CheckCircle2,
  Brain, Heart, Sparkles, Lightbulb, GraduationCap, LineChart,
  Megaphone, GitBranch, Shield, Award, Layers, CircleDot,
  ArrowDownRight, Compass, ClipboardCheck, MessageCircle, Gauge
} from "lucide-react";
import SlideShell from "@/components/metodologia/SlideShell";
import DeckNav from "@/components/metodologia/DeckNav";
import ConversionRail from "@/components/metodologia/ConversionRail";
import PricingSimulator from "@/components/metodologia/PricingSimulator";
import DiagnosticoForm from "@/components/metodologia/DiagnosticoForm";
import WebDeckModals from "@/components/metodologia/WebDeckModals";

const SLIDE_IDS = [
  "s01-hero","s02-problema","s03-tese","s04-framework-geral","s05-mensurar",
  "s06-mtrf","s07-playbook","s08-educar","s09-transformar","s10-evoluir",
  "s11-ili","s12-conformidade-esg","s13-implantacao","s14-fechamento",
  "s15-demo-dashboard","s16-simulador-preco","s17-agendar-fechamento"
];

/* ── Stagger animation helper ── */
const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } },
  item: { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } } },
};
const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.3 }, transition: { duration: 0.6 } };

export default function MTRFWebDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const deckRef = useRef<HTMLDivElement>(null);

  const navigateTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", inline: "start" });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) { const idx = SLIDE_IDS.indexOf(entry.target.id); if (idx >= 0) setCurrentSlide(idx); } }); },
      { threshold: 0.5, root: deckRef.current }
    );
    SLIDE_IDS.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && currentSlide < SLIDE_IDS.length - 1) navigateTo(SLIDE_IDS[currentSlide + 1]);
      else if (e.key === "ArrowLeft" && currentSlide > 0) navigateTo(SLIDE_IDS[currentSlide - 1]);
      else if (e.key === "Escape") setActiveModal(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentSlide, navigateTo]);

  const openModal = (id: string) => setActiveModal(id);

  /* ── Reusable sub-components ── */
  const CTA = ({ label, variant = "primary", onClick }: { label: string; variant?: string; onClick: () => void }) => (
    <Button onClick={onClick} className={variant === "primary"
      ? "bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2 shadow-lg shadow-accent/20 h-11 px-6"
      : "bg-[hsl(210_20%_12%)] hover:bg-[hsl(210_20%_18%)] text-[hsl(210_20%_90%)] border border-[hsl(210_20%_20%)] gap-2 h-11 px-6"}>
      {label} <ArrowRight size={16} />
    </Button>
  );

  const GlassCard = ({ children, className = "", hover = true }: { children: React.ReactNode; className?: string; hover?: boolean }) => (
    <div className={`rounded-2xl border border-[hsl(210_20%_16%)] bg-[hsl(210_25%_9%/0.7)] backdrop-blur-xl p-6 ${hover ? "transition-all duration-300 hover:border-[hsl(210_20%_24%)] hover:bg-[hsl(210_25%_11%/0.7)] hover:shadow-card-hover" : ""} ${className}`}>
      {children}
    </div>
  );

  const TrustBadges = ({ items }: { items: string[] }) => (
    <div className="flex flex-wrap gap-2 mt-5">
      {items.map(item => (
        <Badge key={item} variant="outline" className="border-primary/25 text-primary text-[11px] gap-1.5 py-1 px-2.5">
          <ShieldCheck size={11} /> {item}
        </Badge>
      ))}
    </div>
  );

  const SiglaTooltip = ({ sigla, full, children }: { sigla: string; full: string; children?: React.ReactNode }) => (
    <span className="group relative inline-flex items-center gap-1 cursor-help">
      <span className="font-bold text-accent border-b border-dashed border-accent/40">{sigla}</span>
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-[hsl(210_25%_12%)] border border-[hsl(210_20%_22%)] text-[11px] text-[hsl(210_20%_85%)] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
        <strong className="text-accent">{sigla}</strong> — {full}
        {children}
      </span>
    </span>
  );

  const ExampleBubble = ({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) => (
    <motion.div {...fadeUp} className="flex items-start gap-3 rounded-xl bg-[hsl(210_25%_11%/0.8)] border border-[hsl(210_20%_18%)] p-4">
      <div className="shrink-0 mt-0.5">{icon}</div>
      <div>
        <p className="text-xs font-semibold mb-0.5">{title}</p>
        <p className="text-[11px] text-[hsl(210_20%_58%)] leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );

  const NumberStat = ({ value, label, color = "text-accent" }: { value: string; label: string; color?: string }) => (
    <div className="text-center">
      <motion.p
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        className={`text-3xl md:text-4xl font-bold ${color} mb-1`}
      >
        {value}
      </motion.p>
      <p className="text-[11px] text-[hsl(210_20%_55%)] leading-tight">{label}</p>
    </div>
  );

  return (
    <div className="relative">
      <DeckNav currentSlide={currentSlide} onNavigate={navigateTo} />
      <ConversionRail onOpenForm={() => setFormOpen(true)} onOpenDemo={() => openModal("modal-demo-dashboard")} onNavigate={navigateTo} />
      <DiagnosticoForm open={formOpen} onOpenChange={setFormOpen} />
      <WebDeckModals activeModal={activeModal} onClose={() => setActiveModal(null)} />

      <div ref={deckRef} className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth h-screen" style={{ scrollbarWidth: "none" }}>

        {/* ═══════════════════ S01 — HERO ═══════════════════ */}
        <SlideShell id="s01-hero" variant="gradient">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="max-w-xl">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15, duration: 0.6 }}>
                <Badge className="bg-accent/15 text-accent border-accent/25 mb-6 text-[11px] tracking-wider uppercase font-semibold py-1 px-3">
                  <Sparkles size={12} className="mr-1" /> FT Wellbeing OS — Sistema Operacional de Bem-Estar
                </Badge>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1] mb-5">
                De risco psicossocial a
                <span className="text-gradient-primary"> florescimento organizacional</span>
                — com evidência
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="text-base text-[hsl(210_20%_68%)] mb-3 leading-relaxed">
                Um sistema operacional que integra diagnóstico científico (<SiglaTooltip sigla="COPSOQ III" full="Copenhagen Psychosocial Questionnaire — questionário validado para mapear riscos psicossociais no trabalho" />),
                ciência do bem-estar (<SiglaTooltip sigla="PERMA+V" full="Positive Emotions, Engagement, Relationships, Meaning, Accomplishment + Vitality — modelo de florescimento de Seligman" />) e
                um framework de execução proprietário (<SiglaTooltip sigla="MTR-F" full="Matriz de Transição Risco-Florescimento — mapa 2D que cruza gravidade psicossocial com capacidade de florescimento" />).
              </motion.p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                className="text-sm text-[hsl(210_20%_50%)] mb-8 flex items-center gap-2">
                <Compass size={14} /> Ciclo contínuo: <strong className="text-[hsl(210_20%_75%)]">Mensurar → Educar → Transformar → Evoluir</strong>
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-3">
                <CTA label="Agendar Demonstração (30 min)" onClick={() => setFormOpen(true)} />
                <CTA label="Explorar o Dashboard" variant="secondary" onClick={() => window.location.href = "/copsoq/q1/results/overview"} />
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                <TrustBadges items={["Sem exposição individual", "Agregação mínima", "Trilha auditável", "WCAG 2.2 AA"]} />
              </motion.div>
            </div>

            {/* Right — visual summary */}
            <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.8 }}
              className="hidden lg:block">
              <GlassCard hover={false} className="relative overflow-hidden border-primary/15">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center"><Activity size={16} className="text-primary" /></div>
                    <span className="text-xs font-semibold text-[hsl(210_20%_70%)]">Como funciona, resumido:</span>
                  </div>
                  {[
                    { step: "01", label: "Mensurar", desc: "Diagnóstico COPSOQ III — mapa de riscos e alavancas", color: "text-cycle-mensurar", bg: "bg-cycle-mensurar/10" },
                    { step: "02", label: "Educar", desc: "Trilhas de aprendizagem nascidas do diagnóstico", color: "text-cycle-educar", bg: "bg-cycle-educar/10" },
                    { step: "03", label: "Transformar", desc: "Intervenções no sistema de trabalho priorizadas por ILI", color: "text-cycle-transformar", bg: "bg-cycle-transformar/10" },
                    { step: "04", label: "Evoluir", desc: "Re-medição, QBR e relatório ESG trimestral", color: "text-cycle-evoluir", bg: "bg-cycle-evoluir/10" },
                  ].map((s, i) => (
                    <motion.div key={s.step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + i * 0.15 }}
                      className={`flex items-center gap-3 p-3 rounded-xl ${s.bg} border border-[hsl(210_20%_16%)]`}>
                      <span className={`text-lg font-bold ${s.color} opacity-60 tabular-nums`}>{s.step}</span>
                      <div>
                        <p className={`text-xs font-bold ${s.color}`}>{s.label}</p>
                        <p className="text-[10px] text-[hsl(210_20%_55%)]">{s.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </SlideShell>

        {/* ═══════════════════ S02 — PROBLEMA ═══════════════════ */}
        <SlideShell id="s02-problema" variant="dark">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="max-w-xl">
              <Badge className="bg-copsoq-pathos/15 text-copsoq-pathos border-copsoq-pathos/25 mb-6 text-[11px] uppercase tracking-wider">O problema sistêmico</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
                A crise não é individual — é do <span className="text-copsoq-pathos">sistema de trabalho</span>
              </h2>
              <p className="text-[hsl(210_20%_68%)] text-sm mb-5 leading-relaxed">
                Quando o desenho do trabalho pressiona pessoas além da sua capacidade de recuperação, surgem sinais sistêmicos:
                adoecimento, conflitos, queda de energia, rotatividade e risco reputacional.
              </p>
              <p className="text-[hsl(210_20%_55%)] text-xs mb-6 leading-relaxed">
                Ações isoladas (palestras, apps de meditação, benefícios pontuais) tratam sintomas —
                não o <strong className="text-[hsl(210_20%_80%)]">sistema que os produziu</strong>. Por isso falham.
              </p>
              <GlassCard className="border-copsoq-pathos/15">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-copsoq-pathos shrink-0 mt-0.5" size={18} />
                  <div className="space-y-2">
                    <p className="font-semibold text-sm">O cenário regulatório mudou</p>
                    <p className="text-[11px] text-[hsl(210_20%_58%)]">
                      A <strong className="text-[hsl(210_20%_80%)]">NR-1</strong> (Norma Regulamentadora 1) agora exige que riscos psicossociais
                      sejam identificados, avaliados e gerenciados no <SiglaTooltip sigla="PGR" full="Programa de Gerenciamento de Riscos — documento obrigatório de SST" />.
                      Sem processo contínuo e evidências, a organização fica vulnerável a fiscalização (<SiglaTooltip sigla="NR-28" full="Norma de fiscalização e penalidades — multas e interdições" />).
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Right — impact visualization */}
            <motion.div variants={stagger.container} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="space-y-3">
              {[
                { icon: <Brain size={18} />, title: "Sobrecarga cognitiva", desc: "Demandas excessivas + baixa autonomia = esgotamento. O COPSOQ III mede essa dinâmica em 7 dimensões.", color: "text-copsoq-pathos" },
                { icon: <Users size={18} />, title: "Conflito trabalho-vida", desc: "Quando fronteiras se dissolvem, a recuperação falha. Exemplo: gestor responde WhatsApp às 23h — e normaliza isso na equipe.", color: "text-copsoq-prevencao" },
                { icon: <Megaphone size={18} />, title: "Risco reputacional & jurídico", desc: "Fiscalização NR-28, ações trabalhistas e exposição ESG. A ausência de processo documentado é evidência contra a organização.", color: "text-copsoq-pathos" },
                { icon: <LineChart size={18} />, title: "Impacto financeiro invisível", desc: "Presenteísmo custa 2–3× mais que absenteísmo. Rotatividade em funções-chave pode custar 150% do salário anual por posição.", color: "text-accent" },
              ].map(item => (
                <motion.div key={item.title} variants={stagger.item}
                  className="flex items-start gap-3 p-4 rounded-xl bg-[hsl(210_25%_10%/0.6)] border border-[hsl(210_20%_16%)]">
                  <div className={`${item.color} shrink-0 mt-0.5`}>{item.icon}</div>
                  <div>
                    <p className="text-xs font-semibold mb-1">{item.title}</p>
                    <p className="text-[11px] text-[hsl(210_20%_55%)] leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </SlideShell>

        {/* ═══════════════════ S03 — TESE (4 ciclos) ═══════════════════ */}
        <SlideShell id="s03-tese" variant="dark">
          <div>
            <div className="text-center mb-8">
              <Badge className="bg-primary/15 text-primary border-primary/25 mb-4 text-[11px] uppercase tracking-wider">A Tese</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-3 max-w-3xl mx-auto leading-tight">
                Quatro movimentos que transformam <span className="text-gradient-primary">dados em decisão</span> e decisão em evidência
              </h2>
              <p className="text-[hsl(210_20%_60%)] text-sm max-w-2xl mx-auto">
                Cada ciclo alimenta o próximo. A evidência de um trimestre vira linha de base do seguinte — criando maturidade composta.
              </p>
            </div>

            <motion.div variants={stagger.container} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  step: "01", title: "Mensurar", icon: <Activity size={22} />,
                  color: "text-cycle-mensurar", border: "border-cycle-mensurar/25", bg: "bg-cycle-mensurar/8",
                  desc: "Diagnóstico COPSOQ III — mapeia 7 fatores de risco psicossocial e identifica hotspots por segmento.",
                  example: "Ex: Uma empresa de 500 pessoas descobre que o setor de operações tem risco alto em 'Demandas cognitivas' e 'Conflito trabalho-vida'.",
                  modal: "modal-mensurar"
                },
                {
                  step: "02", title: "Educar", icon: <GraduationCap size={22} />,
                  color: "text-cycle-educar", border: "border-cycle-educar/25", bg: "bg-cycle-educar/8",
                  desc: "Trilhas de microlearning nascidas dos gaps do diagnóstico. Sem conteúdo genérico — cada trilha é ativada por dados.",
                  example: "Ex: Se 'Liderança e reconhecimento' aparece como risco, gestores recebem trilha de feedback justo + segurança psicológica.",
                  modal: "modal-educar"
                },
                {
                  step: "03", title: "Transformar", icon: <Wrench size={22} />,
                  color: "text-cycle-transformar", border: "border-cycle-transformar/25", bg: "bg-cycle-transformar/8",
                  desc: "Intervenções no sistema de trabalho (não só treinamento): carga, autonomia, rituais, protocolos e políticas.",
                  example: "Ex: Redesenho de alocação + política de desconexão digital — priorizadas pelo ILI com dono e prazo.",
                  modal: "modal-transformar"
                },
                {
                  step: "04", title: "Evoluir", icon: <TrendingUp size={22} />,
                  color: "text-cycle-evoluir", border: "border-cycle-evoluir/25", bg: "bg-cycle-evoluir/8",
                  desc: "Re-medição planejada, QBR executivo e relatório ESG trimestral com trilha auditável de evidências.",
                  example: "Ex: Relatório Q1 mostra redução de 18% no risco de estresse e 32% de conclusão de trilhas Educar.",
                  modal: "modal-evoluir"
                },
              ].map(p => (
                <motion.div key={p.step} variants={stagger.item}>
                  <GlassCard className={`${p.border} h-full flex flex-col`}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-lg font-bold ${p.color} opacity-50`}>{p.step}</span>
                      <div className={`${p.color}`}>{p.icon}</div>
                    </div>
                    <h3 className={`font-bold text-base mb-2 ${p.color}`}>{p.title}</h3>
                    <p className="text-xs text-[hsl(210_20%_65%)] mb-3 leading-relaxed">{p.desc}</p>
                    <div className={`${p.bg} rounded-lg p-3 mb-4 flex-1`}>
                      <p className="text-[10px] text-[hsl(210_20%_60%)] leading-relaxed italic">{p.example}</p>
                    </div>
                    <button onClick={() => openModal(p.modal)} className={`text-xs ${p.color} hover:underline flex items-center gap-1 mt-auto`}>
                      Como funciona <ChevronRight size={12} />
                    </button>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>

            <motion.div {...fadeUp} className="mt-6 text-center">
              <p className="text-[11px] text-[hsl(210_20%_45%)] flex items-center justify-center gap-2">
                <GitBranch size={13} /> O ciclo é contínuo: a evidência de Q1 vira baseline de Q2 — maturidade composta ao longo de 12 meses.
              </p>
            </motion.div>
          </div>
        </SlideShell>

        {/* ═══════════════════ S04 — FRAMEWORK MTR-F + ILI ═══════════════════ */}
        <SlideShell id="s04-framework-geral" variant="accent">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="max-w-xl">
              <Badge className="bg-[hsl(0_0%_100%/0.15)] text-white border-[hsl(0_0%_100%/0.2)] mb-6 text-[11px] uppercase tracking-wider">
                Framework proprietário
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                Dois motores que transformam complexidade em <span className="text-accent">clareza de ação</span>
              </h2>
              <p className="text-[hsl(174_30%_85%)] text-sm mb-6 leading-relaxed">
                O método conecta dois instrumentos complementares — nenhum depende de caixa-preta ou intuição:
              </p>

              <div className="space-y-4 mb-6">
                <div className="p-4 rounded-xl bg-[hsl(0_0%_100%/0.08)] border border-[hsl(0_0%_100%/0.12)]">
                  <h3 className="font-bold text-sm mb-1 flex items-center gap-2">
                    <Target size={16} className="text-accent" />
                    <SiglaTooltip sigla="MTR-F" full="Matriz de Transição Risco-Florescimento" /> — O mapa
                  </h3>
                  <p className="text-xs text-[hsl(174_20%_80%)] leading-relaxed">
                    Cruza dois eixos: <strong>gravidade psicossocial</strong> (medida pelo COPSOQ) × <strong>capacidade de florescimento</strong> (drivers do Playbook + PERMA+V).
                    Resultado: cada segmento aparece em uma de 3 zonas — <span className="text-copsoq-pathos font-semibold">Pathos</span>, <span className="text-copsoq-prevencao font-semibold">Prevenção</span> ou <span className="text-copsoq-salus font-semibold">Salus</span>.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[hsl(0_0%_100%/0.08)] border border-[hsl(0_0%_100%/0.12)]">
                  <h3 className="font-bold text-sm mb-1 flex items-center gap-2">
                    <Gauge size={16} className="text-accent" />
                    <SiglaTooltip sigla="ILI" full="Índice Lógico de Intervenções" /> — O priorizador
                  </h3>
                  <p className="text-xs text-[hsl(174_20%_80%)] leading-relaxed">
                    Fórmula transparente: <span className="font-mono text-accent text-[11px]">(S×U×E×N×A) / (C×T×F)</span>.
                    Calcula qual intervenção deve ser executada primeiro, considerando severidade, urgência, evidência científica, pressão normativa e aderência cultural — contra custo, tempo e resistência.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <CTA label="Ver MTR-F por dentro" variant="secondary" onClick={() => openModal("modal-mtrf")} />
                <CTA label="Como o ILI prioriza" variant="secondary" onClick={() => openModal("modal-ili")} />
              </div>
            </div>

            <motion.div {...fadeUp} className="hidden lg:block">
              <GlassCard hover={false} className="border-[hsl(0_0%_100%/0.12)] bg-[hsl(0_0%_100%/0.05)]">
                <p className="text-xs font-semibold text-[hsl(174_20%_80%)] mb-4 flex items-center gap-2">
                  <Lightbulb size={14} className="text-accent" /> Exemplo prático
                </p>
                <div className="space-y-3 text-[11px] text-[hsl(174_20%_75%)] leading-relaxed">
                  <p>1. O COPSOQ III revela que a área de Tecnologia tem <span className="text-copsoq-pathos font-semibold">risco alto</span> em "Demandas quantitativas" e "Conflito trabalho-vida".</p>
                  <p>2. A MTR-F posiciona esse segmento na zona <span className="text-copsoq-pathos font-semibold">Pathos</span> (alto risco, baixo florescimento).</p>
                  <p>3. O ILI prioriza: <span className="text-accent font-semibold">Redesenho de carga + política de desconexão digital</span> (alta severidade, alta urgência, forte evidência, pressão NR-1).</p>
                  <p>4. A trilha Educar ativa módulos de "Gestão de demandas" para gestores e "Fronteiras e priorização" para colaboradores.</p>
                  <p>5. No QBR (Quarterly Business Review), o relatório ESG mostra a evolução do segmento e as evidências geradas.</p>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </SlideShell>

        {/* ═══════════════════ S05 — MENSURAR ═══════════════════ */}
        <SlideShell id="s05-mensurar" variant="dark">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-cycle-mensurar/15 flex items-center justify-center">
                <Activity size={20} className="text-cycle-mensurar" />
              </div>
              <div>
                <Badge className="bg-cycle-mensurar/15 text-cycle-mensurar border-cycle-mensurar/25 text-[10px] uppercase tracking-wider">Ciclo 1</Badge>
                <h2 className="text-2xl md:text-3xl font-bold mt-1">Mensurar: diagnóstico que gera ação, não só relatório</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
              <div className="lg:col-span-2 space-y-4">
                <p className="text-sm text-[hsl(210_20%_68%)] leading-relaxed max-w-2xl">
                  O <SiglaTooltip sigla="COPSOQ III" full="Copenhagen Psychosocial Questionnaire — 3ª edição, validado no Brasil" /> é o instrumento.
                  Ele mapeia <strong className="text-[hsl(210_20%_85%)]">7 fatores</strong> que determinam como o trabalho afeta saúde, energia e relações — da sobrecarga à insegurança, passando por autonomia e significado.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <ExampleBubble
                    icon={<MessageCircle size={16} className="text-cycle-mensurar" />}
                    title="Experiência guiada por chatbot (EliAs)"
                    desc="O EliAs explica o porquê de cada pergunta, reduz ansiedade e reforça sigilo. Linguagem simples, sem termos clínicos. Acessível (WCAG 2.2 AA)."
                  />
                  <ExampleBubble
                    icon={<Lock size={16} className="text-primary" />}
                    title="Privacidade radical (LGPD by design)"
                    desc="Resultados apenas agregados. Célula mínima de 8 pessoas. Sem ranking. Sem exposição individual em dashboards. Trilha de auditoria completa."
                  />
                </div>

                <GlassCard className="border-cycle-mensurar/15">
                  <p className="text-xs font-semibold mb-2 flex items-center gap-2">
                    <Lightbulb size={13} className="text-accent" /> Saída dupla do diagnóstico
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[11px] font-semibold text-copsoq-pathos mb-1">Mapa de riscos</p>
                      <p className="text-[10px] text-[hsl(210_20%_55%)]">Onde a organização está "sangrando" — demandas, conflitos, insegurança, falta de suporte.</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-copsoq-salus mb-1">Mapa de alavancas</p>
                      <p className="text-[10px] text-[hsl(210_20%_55%)]">Onde já existem recursos — autonomia, significado, comunidade — que podem ser amplificados.</p>
                    </div>
                  </div>
                </GlassCard>
              </div>

              {/* Right — 7 factors */}
              <GlassCard className="border-cycle-mensurar/15">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-cycle-mensurar mb-3">7 Fatores COPSOQ</p>
                {[
                  "Satisfação e Autoeficácia",
                  "Sintomas de Estresse e Depressão",
                  "Demandas e Conflito Trabalho-Vida",
                  "Influência e Autonomia",
                  "Comunidade, Significado e Desenvolvimento",
                  "Reconhecimento e Liderança",
                  "Insegurança no Trabalho",
                ].map((f, i) => (
                  <div key={f} className="flex items-center gap-2 py-1.5 border-b border-[hsl(210_20%_14%)] last:border-0">
                    <span className="text-[10px] font-bold text-cycle-mensurar/50 w-4">{i+1}</span>
                    <span className="text-[11px] text-[hsl(210_20%_70%)]">{f}</span>
                  </div>
                ))}
                <button onClick={() => openModal("modal-survey-engine")} className="text-[11px] text-cycle-mensurar hover:underline flex items-center gap-1 mt-3">
                  Como funciona o motor <ChevronRight size={11} />
                </button>
              </GlassCard>
            </div>
          </div>
        </SlideShell>

        {/* ═══════════════════ S06 — MTR-F ═══════════════════ */}
        <SlideShell id="s06-mtrf" variant="dark">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="max-w-xl">
              <Badge className="bg-primary/15 text-primary border-primary/25 mb-5 text-[11px] uppercase tracking-wider">MTR-F</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                Um mapa 2D que transforma <span className="text-gradient-primary">complexidade em decisão</span> em 60 segundos
              </h2>
              <p className="text-sm text-[hsl(210_20%_68%)] mb-5 leading-relaxed">
                A <SiglaTooltip sigla="MTR-F" full="Matriz de Transição Risco-Florescimento" /> cruza dois eixos independentes.
                Cada segmento da organização aparece como um ponto no mapa — e cada zona sugere ações diferentes.
              </p>

              <div className="space-y-3 mb-5">
                {[
                  { zone: "Pathos", color: "text-copsoq-pathos", bg: "bg-copsoq-pathos/10", desc: "Alto risco. Intervenção urgente no sistema: carga, suporte, protocolos." },
                  { zone: "Prevenção", color: "text-copsoq-prevencao", bg: "bg-copsoq-prevencao/10", desc: "Risco moderado. Educar + fortalecer alavancas antes que escalem." },
                  { zone: "Salus", color: "text-copsoq-salus", bg: "bg-copsoq-salus/10", desc: "Baixo risco. Sustentar, amplificar e documentar boas práticas." },
                ].map(z => (
                  <div key={z.zone} className={`flex items-center gap-3 p-3 rounded-xl ${z.bg} border border-[hsl(210_20%_16%)]`}>
                    <CircleDot size={16} className={z.color} />
                    <div>
                      <span className={`text-xs font-bold ${z.color}`}>{z.zone}</span>
                      <p className="text-[10px] text-[hsl(210_20%_55%)]">{z.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <CTA label="Ver exemplo visual completo" variant="secondary" onClick={() => openModal("modal-mtrf-visual")} />
            </div>

            {/* Right — Interactive MTR-F */}
            <motion.div {...fadeUp}>
              <GlassCard hover={false} className="border-primary/15 relative overflow-hidden">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[hsl(210_20%_50%)] mb-4">Matriz de Transição Risco-Florescimento</p>
                <div className="relative aspect-square max-h-[320px] mx-auto">
                  {/* Grid background */}
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-0.5 rounded-xl overflow-hidden">
                    {/* Bottom-left (high flourishing, low risk) */}
                    <div className="bg-copsoq-salus/15 flex items-center justify-center"><span className="text-[8px] text-copsoq-salus/60">Salus</span></div>
                    <div className="bg-copsoq-salus/10" />
                    <div className="bg-copsoq-prevencao/10" />
                    {/* Middle row */}
                    <div className="bg-copsoq-salus/10" />
                    <div className="bg-copsoq-prevencao/15 flex items-center justify-center"><span className="text-[8px] text-copsoq-prevencao/60">Prevenção</span></div>
                    <div className="bg-copsoq-prevencao/10" />
                    {/* Top row (high risk) */}
                    <div className="bg-copsoq-prevencao/10" />
                    <div className="bg-copsoq-pathos/10" />
                    <div className="bg-copsoq-pathos/15 flex items-center justify-center"><span className="text-[8px] text-copsoq-pathos/60">Pathos</span></div>
                  </div>
                  {/* Example dots */}
                  {[
                    { x: 22, y: 75, label: "Adm", color: "bg-copsoq-salus" },
                    { x: 45, y: 48, label: "Comercial", color: "bg-copsoq-prevencao" },
                    { x: 70, y: 25, label: "Operações", color: "bg-copsoq-pathos" },
                    { x: 35, y: 60, label: "RH", color: "bg-copsoq-salus" },
                    { x: 60, y: 35, label: "TI", color: "bg-copsoq-pathos" },
                  ].map((dot, i) => (
                    <motion.div
                      key={dot.label}
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.12, type: "spring", stiffness: 200 }}
                      className={`absolute ${dot.color} w-7 h-7 rounded-full flex items-center justify-center text-[7px] font-bold text-white shadow-lg cursor-default`}
                      style={{ left: `${dot.x}%`, top: `${dot.y}%`, transform: "translate(-50%, -50%)" }}
                      title={dot.label}
                    >
                      {dot.label.charAt(0)}
                    </motion.div>
                  ))}
                </div>
                <div className="flex justify-between mt-3 text-[9px] text-[hsl(210_20%_45%)]">
                  <span>← Capacidade de florescimento</span>
                  <span>Gravidade do risco →</span>
                </div>
                <div className="flex justify-between text-[9px] text-[hsl(210_20%_35%)] mt-0.5">
                  <span>(Playbook + PERMA+V)</span>
                  <span>(COPSOQ III)</span>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </SlideShell>

        {/* ═══════════════════ S07 — PLAYBOOK ═══════════════════ */}
        <SlideShell id="s07-playbook" variant="dark">
          <div>
            <Badge className="bg-accent/15 text-accent border-accent/25 mb-5 text-[11px] uppercase tracking-wider">Base científica</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-3 max-w-3xl">
              12 drivers que explicam <span className="text-accent">o que fazer</span> — não só o que está errado
            </h2>
            <p className="text-sm text-[hsl(210_20%_65%)] mb-6 max-w-2xl leading-relaxed">
              O <SiglaTooltip sigla="Work Wellbeing Playbook" full="Framework baseado em evidências que organiza intervenções em 12 drivers de bem-estar no trabalho" /> conecta
              cada hotspot do diagnóstico a drivers de ação. Cada driver tem intervenções validadas por pesquisa.
            </p>

            <motion.div variants={stagger.container} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                { driver: "Stress", icon: <Brain size={16} />, desc: "Identificar estressores + redesenho de carga" },
                { driver: "Support", icon: <Heart size={16} />, desc: "Acessibilidade gerencial + peer support" },
                { driver: "Management", icon: <Users size={16} />, desc: "Liderança capacitada + feedback justo" },
                { driver: "Trust", icon: <Shield size={16} />, desc: "Segurança psicológica + consistência" },
                { driver: "Purpose", icon: <Compass size={16} />, desc: "Significado + conexão com impacto" },
                { driver: "Flexibility", icon: <Zap size={16} />, desc: "Controle de agenda + desconexão digital" },
                { driver: "Learning", icon: <GraduationCap size={16} />, desc: "Desenvolvimento contínuo orientado" },
                { driver: "Energy", icon: <Activity size={16} />, desc: "Ritmos sustentáveis + recuperação" },
                { driver: "Achievement", icon: <Award size={16} />, desc: "Metas realistas + progresso visível" },
                { driver: "Appreciation", icon: <Sparkles size={16} />, desc: "Reconhecimento estruturado (SAGE)" },
                { driver: "Inclusion", icon: <Layers size={16} />, desc: "Pertencimento + equidade de acesso" },
                { driver: "Compensation", icon: <BarChart3 size={16} />, desc: "Justiça percebida + transparência" },
              ].map(d => (
                <motion.div key={d.driver} variants={stagger.item}
                  className="p-3 rounded-xl bg-[hsl(210_25%_10%/0.6)] border border-[hsl(210_20%_16%)] hover:border-accent/25 transition-colors">
                  <div className="text-accent mb-2">{d.icon}</div>
                  <p className="text-xs font-bold mb-1">{d.driver}</p>
                  <p className="text-[10px] text-[hsl(210_20%_52%)] leading-relaxed">{d.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div {...fadeUp} className="mt-5">
              <CTA label="Ver drivers com exemplos reais" variant="secondary" onClick={() => openModal("modal-playbook-drivers")} />
            </motion.div>
          </div>
        </SlideShell>

        {/* ═══════════════════ S08 — EDUCAR ═══════════════════ */}
        <SlideShell id="s08-educar" variant="dark">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-xl bg-cycle-educar/15 flex items-center justify-center">
                  <GraduationCap size={20} className="text-cycle-educar" />
                </div>
                <div>
                  <Badge className="bg-cycle-educar/15 text-cycle-educar border-cycle-educar/25 text-[10px] uppercase tracking-wider">Ciclo 2</Badge>
                  <h2 className="text-2xl md:text-3xl font-bold mt-1">Educar: trilhas que nascem do diagnóstico</h2>
                </div>
              </div>
              <p className="text-sm text-[hsl(210_20%_68%)] mb-5 leading-relaxed">
                Sem conteúdo genérico. Cada trilha é <strong className="text-[hsl(210_20%_85%)]">ativada por um gatilho de dados</strong> — se o risco não apareceu, a trilha não é criada. Isso é design instrucional de precisão.
              </p>

              <div className="space-y-3 mb-5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-cycle-educar">Princípios de aprendizagem</p>
                {[
                  "Microlearning — módulos curtos, focados, praticáveis",
                  "Prática guiada — não só leitura, mas aplicação em contexto real",
                  "Spaced repetition — reforço espaçado para retenção",
                  "Evidência de transferência — não mede só consumo, mede prática",
                ].map(p => (
                  <div key={p} className="flex items-center gap-2 text-[11px] text-[hsl(210_20%_68%)]">
                    <CheckCircle2 size={12} className="text-cycle-educar shrink-0" /> {p}
                  </div>
                ))}
              </div>
              <CTA label="Ver exemplo de trilha completa" variant="secondary" onClick={() => openModal("modal-exemplo-trilha")} />
            </div>

            {/* Right — Example track */}
            <motion.div {...fadeUp}>
              <GlassCard hover={false} className="border-cycle-educar/15">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-cycle-educar mb-4 flex items-center gap-2">
                  <Lightbulb size={12} /> Exemplo de trilha ativada
                </p>
                <div className="p-4 rounded-xl bg-cycle-educar/8 border border-cycle-educar/15 mb-4">
                  <p className="text-xs font-bold mb-1 text-cycle-educar">Trilha: Demandas e Equilíbrio Trabalho-Vida</p>
                  <p className="text-[10px] text-[hsl(210_20%_55%)] mb-2">
                    Gatilho: risco <span className="text-copsoq-pathos font-semibold">ALTO</span> ou <span className="text-copsoq-prevencao font-semibold">MODERADO</span> em "Conflito Trabalho-Vida"
                  </p>
                  <p className="text-[10px] text-[hsl(210_20%_55%)]">Audiência: Colaboradores + Gestores</p>
                </div>
                <div className="space-y-2">
                  {[
                    { mod: "Mod 1", title: "Fronteiras e priorização", time: "8 min" },
                    { mod: "Mod 2", title: "Neurociência do estresse e recuperação", time: "12 min" },
                    { mod: "Mod 3", title: "Acordos de trabalho (prática guiada)", time: "15 min" },
                    { mod: "Mod 4", title: "Liderança: capacidade vs. demanda", time: "10 min" },
                  ].map(m => (
                    <div key={m.mod} className="flex items-center justify-between p-2.5 rounded-lg bg-[hsl(210_25%_10%)] border border-[hsl(210_20%_15%)]">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-cycle-educar/60">{m.mod}</span>
                        <span className="text-[11px]">{m.title}</span>
                      </div>
                      <span className="text-[9px] text-[hsl(210_20%_45%)]">{m.time}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[9px] text-[hsl(210_20%_40%)] mt-3 italic">Evidência: checklist de prática + reflexão + avaliação de transferência.</p>
              </GlassCard>
            </motion.div>
          </div>
        </SlideShell>

        {/* ═══════════════════ S09 — TRANSFORMAR ═══════════════════ */}
        <SlideShell id="s09-transformar" variant="dark">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-xl bg-cycle-transformar/15 flex items-center justify-center">
                  <Wrench size={20} className="text-cycle-transformar" />
                </div>
                <div>
                  <Badge className="bg-cycle-transformar/15 text-cycle-transformar border-cycle-transformar/25 text-[10px] uppercase tracking-wider">Ciclo 3</Badge>
                  <h2 className="text-2xl md:text-3xl font-bold mt-1">Transformar: mexer no sistema, não só nas pessoas</h2>
                </div>
              </div>
              <p className="text-sm text-[hsl(210_20%_68%)] mb-5 leading-relaxed">
                "Palestra de bem-estar" não muda carga de trabalho. <strong className="text-[hsl(210_20%_85%)]">Transformar opera no sistema</strong>:
                processos, alocação, rituais, protocolos, políticas e papéis — com dono, prazo e evidência.
              </p>
              <p className="text-xs text-[hsl(210_20%_55%)] mb-5">
                Cada intervenção precisa de: hipótese, KPI de processo, KPI de resultado, responsável, prazo, evidência e critério de revisão.
              </p>
              <CTA label="Ver backlog priorizado (ILI)" variant="secondary" onClick={() => openModal("modal-backlog-ili")} />
            </div>

            {/* Right — Portfolio */}
            <motion.div variants={stagger.container} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="space-y-2.5">
              {[
                { action: "Redesenho de carga e alocação", driver: "Stress / Energy", priority: "Alta", color: "border-copsoq-pathos/25" },
                { action: "Política de desconexão digital", driver: "Flexibility", priority: "Alta", color: "border-copsoq-pathos/25" },
                { action: "Protocolo antiassédio com canal de resposta", driver: "Trust / Support", priority: "Alta", color: "border-copsoq-pathos/25" },
                { action: "Rituais de alinhamento + retrospectiva segura", driver: "Management / Trust", priority: "Média", color: "border-copsoq-prevencao/25" },
                { action: "Reconhecimento estruturado (modelo SAGE)", driver: "Appreciation", priority: "Média", color: "border-copsoq-prevencao/25" },
                { action: "Liderança prática supervisionada", driver: "Management / Learning", priority: "Média", color: "border-copsoq-prevencao/25" },
              ].map(item => (
                <motion.div key={item.action} variants={stagger.item}
                  className={`flex items-center justify-between p-3.5 rounded-xl bg-[hsl(210_25%_10%/0.6)] border ${item.color}`}>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={14} className="text-cycle-transformar shrink-0" />
                    <div>
                      <p className="text-xs font-medium">{item.action}</p>
                      <p className="text-[10px] text-[hsl(210_20%_50%)]">Driver: {item.driver}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[9px] border-[hsl(210_20%_20%)] text-[hsl(210_20%_60%)]">{item.priority}</Badge>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </SlideShell>

        {/* ═══════════════════ S10 — EVOLUIR ═══════════════════ */}
        <SlideShell id="s10-evoluir" variant="dark">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-xl bg-cycle-evoluir/15 flex items-center justify-center">
                  <TrendingUp size={20} className="text-cycle-evoluir" />
                </div>
                <div>
                  <Badge className="bg-cycle-evoluir/15 text-cycle-evoluir border-cycle-evoluir/25 text-[10px] uppercase tracking-wider">Ciclo 4</Badge>
                  <h2 className="text-2xl md:text-3xl font-bold mt-1">Evoluir: governança, re-medição e relatório ESG</h2>
                </div>
              </div>
              <p className="text-sm text-[hsl(210_20%_68%)] mb-5 leading-relaxed">
                O ciclo se fecha quando a organização re-mede, compara com a baseline e gera um <SiglaTooltip sigla="QBR" full="Quarterly Business Review — revisão trimestral executiva com KPIs, decisões e próximos passos" /> com prestação de contas.
              </p>
              <p className="text-xs text-[hsl(210_20%_55%)] mb-5 leading-relaxed">
                O relatório <SiglaTooltip sigla="ESG" full="Environmental, Social and Governance — reporte de sustentabilidade com indicadores sociais" /> trimestral
                não é marketing: é trilha auditável de evidências que comprova ação contínua e responsável.
              </p>
              <CTA label="Ver estrutura do relatório ESG" variant="secondary" onClick={() => openModal("modal-relatorio-esg")} />
            </div>

            <motion.div {...fadeUp}>
              <GlassCard hover={false} className="border-cycle-evoluir/15">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-cycle-evoluir mb-4">Exemplo: KPIs do relatório Q1</p>
                <div className="grid grid-cols-2 gap-4">
                  <NumberStat value="87%" label="Taxa de resposta COPSOQ" color="text-primary" />
                  <NumberStat value="-18%" label="Redução de risco global" color="text-copsoq-salus" />
                  <NumberStat value="32%" label="Conclusão trilhas Educar" color="text-cycle-educar" />
                  <NumberStat value="8/12" label="Intervenções em execução" color="text-cycle-transformar" />
                </div>
                <div className="mt-4 p-3 rounded-lg bg-cycle-evoluir/8 border border-cycle-evoluir/15">
                  <p className="text-[10px] text-[hsl(210_20%_60%)] leading-relaxed">
                    O relatório inclui: sumário executivo, KPIs, checklist NR-1, catálogo de evidências,
                    prints agregados (anonimizados) e plano do próximo ciclo.
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </SlideShell>

        {/* ═══════════════════ S11 — ILI EQUATION ═══════════════════ */}
        <SlideShell id="s11-ili" variant="dark">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Badge className="bg-accent/15 text-accent border-accent/25 mb-4 text-[11px] uppercase tracking-wider">Priorização explicável</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                <SiglaTooltip sigla="ILI" full="Índice Lógico de Intervenções" />: como decidimos <span className="text-accent">o que fazer primeiro</span>
              </h2>
              <p className="text-sm text-[hsl(210_20%_60%)] max-w-xl mx-auto">
                Sem caixa-preta. Cada variável é explícita e pode ser debatida pelo comitê de governança.
              </p>
            </div>

            <GlassCard hover={false} className="border-accent/20 text-center mb-6">
              <motion.p initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }}
                className="text-3xl md:text-5xl font-mono font-bold text-accent tracking-wide mb-8">
                ILI = (S×U×E×N×A) / (C×T×F)
              </motion.p>

              <div className="grid grid-cols-2 gap-x-8 gap-y-0 max-w-2xl mx-auto">
                <div className="text-left mb-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-copsoq-salus mb-2">Numerador (impulsiona prioridade)</p>
                  {[
                    { letter: "S", name: "Severidade", desc: "Quão grave é o risco (dados COPSOQ)" },
                    { letter: "U", name: "Urgência", desc: "Velocidade de propagação do dano" },
                    { letter: "E", name: "Evidência", desc: "Força da base científica (Playbook)" },
                    { letter: "N", name: "P. normativa", desc: "Pressão regulatória (NR-1, NR-28)" },
                    { letter: "A", name: "Aderência", desc: "Compatibilidade cultural da ação" },
                  ].map(v => (
                    <div key={v.letter} className="flex items-start gap-2 py-1.5">
                      <span className="text-sm font-bold text-accent w-4">{v.letter}</span>
                      <div>
                        <span className="text-xs font-medium">{v.name}</span>
                        <p className="text-[10px] text-[hsl(210_20%_48%)]">{v.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-left mb-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-copsoq-pathos mb-2">Denominador (modera prioridade)</p>
                  {[
                    { letter: "C", name: "Custo", desc: "Investimento financeiro necessário" },
                    { letter: "T", name: "Tempo", desc: "Prazo até efeito mensurável" },
                    { letter: "F", name: "Fricção", desc: "Complexidade e resistência à adoção" },
                  ].map(v => (
                    <div key={v.letter} className="flex items-start gap-2 py-1.5">
                      <span className="text-sm font-bold text-copsoq-pathos w-4">{v.letter}</span>
                      <div>
                        <span className="text-xs font-medium">{v.name}</span>
                        <p className="text-[10px] text-[hsl(210_20%_48%)]">{v.desc}</p>
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 p-3 rounded-lg bg-accent/8 border border-accent/15">
                    <p className="text-[10px] text-[hsl(210_20%_60%)] leading-relaxed">
                      <strong className="text-accent">Importante:</strong> O ILI não substitui governança.
                      É suporte à decisão — o comitê valida e pode ajustar pesos.
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
            <div className="text-center">
              <CTA label="Entender todas as variáveis" variant="secondary" onClick={() => openModal("modal-ili-detalhe")} />
            </div>
          </div>
        </SlideShell>

        {/* ═══════════════════ S12 — CONFORMIDADE & ESG ═══════════════════ */}
        <SlideShell id="s12-conformidade-esg" variant="dark">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="max-w-xl">
              <Badge className="bg-primary/15 text-primary border-primary/25 mb-5 text-[11px] uppercase tracking-wider">Compliance & ESG</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                Prontidão documental — não <span className="text-primary">"conformidade automática"</span>
              </h2>
              <p className="text-sm text-[hsl(210_20%_68%)] mb-5 leading-relaxed">
                O método não promete "estar em conformidade automaticamente". Promete <strong className="text-[hsl(210_20%_85%)]">rastreabilidade, evidências organizadas e governança recorrente</strong> — o que auditorias e fiscalizações efetivamente verificam.
              </p>

              <GlassCard className="border-primary/15 mb-5">
                <p className="text-xs font-semibold mb-3 flex items-center gap-2">
                  <ClipboardCheck size={14} className="text-primary" /> Checklist NR-1 coberto pelo método
                </p>
                {[
                  "Identificação de perigos psicossociais",
                  "Avaliação e classificação de risco (COPSOQ + MTR-F)",
                  "Plano de ação (backlog ILI + Transformar)",
                  "Acompanhamento e revisão (QBR + re-medição)",
                  "Participação/consulta de trabalhadores (EliAs + consent)",
                  "Registro — inventário e plano documentados (audit log)",
                ].map(item => (
                  <div key={item} className="flex items-center gap-2 py-1.5 text-[11px] text-[hsl(210_20%_68%)]">
                    <CheckCircle2 size={12} className="text-primary shrink-0" /> {item}
                  </div>
                ))}
              </GlassCard>
              <CTA label="Ver catálogo de evidências" variant="secondary" onClick={() => openModal("modal-evidencias")} />
            </div>

            <motion.div variants={stagger.container} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="space-y-3">
              {[
                { sigla: "NR-1", full: "Norma Regulamentadora 1 — GRO/PGR", desc: "Exige processo contínuo para riscos psicossociais. O método gera evidência em cada etapa.", icon: <Shield size={18} /> },
                { sigla: "NR-28", full: "Fiscalização e penalidades", desc: "Prontidão documental: cada ação tem registro, responsável e timestamp.", icon: <ClipboardCheck size={18} /> },
                { sigla: "ESG Social", full: "Reporte de sustentabilidade", desc: "Relatório trimestral com KPIs, decisões, evidências e plano do próximo ciclo.", icon: <FileText size={18} /> },
              ].map(item => (
                <motion.div key={item.sigla} variants={stagger.item}
                  className="p-4 rounded-xl bg-[hsl(210_25%_10%/0.6)] border border-[hsl(210_20%_16%)] hover:border-primary/20 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="text-primary shrink-0 mt-0.5">{item.icon}</div>
                    <div>
                      <p className="text-xs font-bold mb-0.5">{item.sigla} — <span className="font-normal text-[hsl(210_20%_60%)]">{item.full}</span></p>
                      <p className="text-[11px] text-[hsl(210_20%_55%)] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </SlideShell>

        {/* ═══════════════════ S13 — IMPLANTAÇÃO ═══════════════════ */}
        <SlideShell id="s13-implantacao" variant="dark">
          <div>
            <div className="text-center mb-8">
              <Badge className="bg-accent/15 text-accent border-accent/25 mb-4 text-[11px] uppercase tracking-wider">Implantação</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                90 dias para pilotar. 12 meses para <span className="text-accent">institucionalizar</span>.
              </h2>
              <p className="text-sm text-[hsl(210_20%_60%)] max-w-xl mx-auto">
                Comece com um piloto focado (Q1) e escale com evidência. O método evita projeto sem continuidade.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {[
                {
                  phase: "0–30 dias", name: "Preparação & Mensurar", color: "border-cycle-mensurar/25", badge: "bg-cycle-mensurar/15 text-cycle-mensurar",
                  items: [
                    { text: "Governança, escopo e comitê definidos", done: true },
                    { text: "Onboarding da organização + segmentos", done: true },
                    { text: "Campanha COPSOQ III (survey + EliAs)", done: true },
                    { text: "Linha de base e mapa de hotspots", done: true },
                  ]
                },
                {
                  phase: "31–60 dias", name: "Educar + Desenhar Portfólio", color: "border-cycle-educar/25", badge: "bg-cycle-educar/15 text-cycle-educar",
                  items: [
                    { text: "Dashboard + MTR-F disponíveis", done: false },
                    { text: "Trilhas Educar ativadas por dados", done: false },
                    { text: "Priorização ILI do backlog", done: false },
                    { text: "Plano de intervenção com responsáveis", done: false },
                  ]
                },
                {
                  phase: "61–90 dias", name: "Transformar + Evoluir", color: "border-cycle-transformar/25", badge: "bg-cycle-transformar/15 text-cycle-transformar",
                  items: [
                    { text: "Execução das primeiras intervenções", done: false },
                    { text: "Coleta de evidências de prática", done: false },
                    { text: "QBR — revisão trimestral executiva", done: false },
                    { text: "Relatório ESG Q1 gerado", done: false },
                  ]
                },
              ].map(p => (
                <GlassCard key={p.phase} className={`${p.color}`}>
                  <Badge className={`${p.badge} border-transparent text-[10px] mb-3`}>{p.phase}</Badge>
                  <h3 className="font-bold text-sm mb-4">{p.name}</h3>
                  <div className="space-y-2.5">
                    {p.items.map(i => (
                      <div key={i.text} className="flex items-start gap-2 text-[11px] text-[hsl(210_20%_65%)]">
                        <CheckCircle2 size={13} className={`shrink-0 mt-0.5 ${i.done ? "text-copsoq-salus" : "text-[hsl(210_20%_30%)]"}`} />
                        {i.text}
                      </div>
                    ))}
                  </div>
                </GlassCard>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <CTA label="Solicitar Proposta de Piloto (90 dias)" onClick={() => setFormOpen(true)} />
              <CTA label="Programa Anual (12 meses)" variant="secondary" onClick={() => setFormOpen(true)} />
            </div>
          </div>
        </SlideShell>

        {/* ═══════════════════ S14 — FECHAMENTO ═══════════════════ */}
        <SlideShell id="s14-fechamento" variant="gradient">
          <div className="max-w-3xl text-center mx-auto">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-5xl font-bold mb-5 leading-tight">
                Bem-estar não é benefício.
                <br />
                <span className="text-gradient-primary">É infraestrutura de performance e governança.</span>
              </h2>
              <p className="text-base text-[hsl(210_20%_68%)] mb-8 max-w-lg mx-auto leading-relaxed">
                Se você quer evidência, execução e rastreabilidade — e não mais um programa que morre no segundo mês — comece agora.
              </p>
              <div className="flex flex-wrap gap-3 justify-center mb-6">
                <CTA label="Agendar Demonstração (30 min)" onClick={() => setFormOpen(true)} />
                <CTA label="Explorar o Dashboard" variant="secondary" onClick={() => window.location.href = "/copsoq/q1/results/overview"} />
                <CTA label="Simular investimento" variant="secondary" onClick={() => navigateTo("s16-simulador-preco")} />
              </div>
              <TrustBadges items={["Sem exposição individual", "Agregação mínima", "Trilha auditável"]} />
            </motion.div>
          </div>
        </SlideShell>

        {/* ═══════════════════ S15 — DEMO DASHBOARD ═══════════════════ */}
        <SlideShell id="s15-demo-dashboard" variant="dark">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="max-w-xl">
              <Badge className="bg-primary/15 text-primary border-primary/25 mb-5 text-[11px] uppercase tracking-wider">Dashboard ao vivo</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                Veja o dashboard real — <span className="text-primary">sem setup</span>
              </h2>
              <p className="text-sm text-[hsl(210_20%_68%)] mb-5 leading-relaxed">
                Explore a visão executiva com dados demonstrativos: KPIs, heatmap de hotspots, MTR-F interativa e backlog priorizado por ILI.
              </p>
              <p className="text-xs text-[hsl(210_20%_50%)] mb-6">
                Dados fictícios para demonstração. A versão real opera com agregação e minCellSize aplicados.
              </p>
              <div className="flex flex-wrap gap-3">
                <CTA label="Entrar no Dashboard" onClick={() => window.location.href = "/copsoq/q1/results/overview"} />
                <CTA label="O que você verá" variant="secondary" onClick={() => openModal("modal-demo-o-que-ver")} />
              </div>
            </div>

            <motion.div {...fadeUp}>
              <GlassCard hover={false} className="border-primary/15">
                <div className="aspect-video rounded-xl bg-[hsl(210_25%_6%)] flex items-center justify-center border border-dashed border-primary/20 relative overflow-hidden group cursor-pointer"
                  onClick={() => window.location.href = "/copsoq/q1/results/overview"}>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="text-center z-10">
                    <motion.div whileHover={{ scale: 1.1 }} className="inline-block">
                      <Play className="text-primary mx-auto mb-3" size={48} />
                    </motion.div>
                    <p className="text-sm font-semibold mb-1">Dashboard demonstrativo</p>
                    <p className="text-[10px] text-[hsl(210_20%_45%)]">Clique para explorar com dados fictícios</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </SlideShell>

        {/* ═══════════════════ S16 — SIMULADOR DE PREÇO ═══════════════════ */}
        <section
          id="s16-simulador-preco"
          className="deck-slide w-screen h-screen flex-shrink-0 snap-start snap-always relative flex items-center justify-center bg-[hsl(210_25%_8%)] text-[hsl(210_20%_95%)] overflow-y-auto"
        >
          <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-16 md:py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-6">
                <Badge className="bg-accent/15 text-accent border-accent/25 mb-3 text-[11px] uppercase tracking-wider">
                  <Sparkles size={11} className="mr-1" /> Investimento
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold mb-1.5">
                  Quanto custa cuidar de quem faz sua empresa funcionar?
                </h2>
                <p className="text-[hsl(210_20%_55%)] text-xs max-w-lg mx-auto">
                  Preço por pessoa com descontos progressivos por volume. Transparente e sem surpresas.
                </p>
              </div>
              <PricingSimulator onRequestProposal={() => setFormOpen(true)} />
              <div className="mt-4 text-center">
                <button onClick={() => openModal("modal-preco-metodo")} className="text-xs text-[hsl(210_20%_50%)] hover:text-[hsl(210_20%_80%)] hover:underline inline-flex items-center gap-1">
                  <Eye size={12} /> Como calculamos (transparência)
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════ S17 — FINAL CTA ═══════════════════ */}
        <SlideShell id="s17-agendar-fechamento" variant="gradient">
          <div className="max-w-3xl text-center mx-auto">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Badge className="bg-accent/15 text-accent border-accent/25 mb-6 text-[11px] uppercase tracking-wider">Próximo passo</Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-5 leading-tight">
                Comece com Q1 COPSOQ — <span className="text-accent">90 dias</span>
              </h2>
              <p className="text-base text-[hsl(210_20%_68%)] mb-8 max-w-xl mx-auto leading-relaxed">
                Blindagem & Consolidação: mensure com rigor, eduque por dados, transforme o sistema de trabalho e gere evidências ESG no primeiro trimestre.
              </p>
              <div className="flex flex-wrap gap-3 justify-center mb-6">
                <CTA label="Agendar Demonstração (30 min)" onClick={() => setFormOpen(true)} />
                <Button variant="outline" className="border-[hsl(210_20%_22%)] text-[hsl(210_20%_80%)] gap-2 h-11 px-6">
                  <FileText size={16} /> Baixar resumo executivo (TBD)
                </Button>
              </div>
              <TrustBadges items={["Sem exposição individual", "Agregação mínima", "Trilha auditável", "Acessibilidade WCAG 2.2 AA"]} />
            </motion.div>
          </div>
        </SlideShell>

      </div>
    </div>
  );
}

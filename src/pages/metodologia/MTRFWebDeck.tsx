import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck, ArrowRight, Activity, BookOpen, Wrench, TrendingUp,
  BarChart3, Calculator, Zap, Target, Users, FileText, Calendar,
  ChevronRight, Lock, Eye, Layers, AlertTriangle, Play, CheckCircle2
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

export default function MTRFWebDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const deckRef = useRef<HTMLDivElement>(null);

  const navigateTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", inline: "start" });
  }, []);

  // Track current slide via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = SLIDE_IDS.indexOf(entry.target.id);
            if (idx >= 0) setCurrentSlide(idx);
          }
        });
      },
      { threshold: 0.5, root: deckRef.current }
    );
    SLIDE_IDS.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && currentSlide < SLIDE_IDS.length - 1) {
        navigateTo(SLIDE_IDS[currentSlide + 1]);
      } else if (e.key === "ArrowLeft" && currentSlide > 0) {
        navigateTo(SLIDE_IDS[currentSlide - 1]);
      } else if (e.key === "Escape") {
        setActiveModal(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentSlide, navigateTo]);

  const openModal = (id: string) => setActiveModal(id);

  const CTA = ({ label, variant = "primary", onClick }: { label: string; variant?: string; onClick: () => void }) => (
    <Button
      onClick={onClick}
      className={variant === "primary"
        ? "bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2 shadow-lg"
        : "bg-[hsl(210_20%_15%)] hover:bg-[hsl(210_20%_20%)] text-[hsl(210_20%_90%)] border border-[hsl(210_20%_22%)] gap-2"
      }
    >
      {label} <ArrowRight size={16} />
    </Button>
  );

  const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`rounded-xl border border-[hsl(210_20%_18%)] bg-[hsl(210_25%_10%/0.6)] backdrop-blur-md p-5 ${className}`}>
      {children}
    </div>
  );

  const TrustBadges = ({ items }: { items: string[] }) => (
    <div className="flex flex-wrap gap-2 mt-4">
      {items.map(item => (
        <Badge key={item} variant="outline" className="border-primary/30 text-primary text-[11px] gap-1">
          <ShieldCheck size={12} /> {item}
        </Badge>
      ))}
    </div>
  );

  return (
    <div className="relative">
      <DeckNav currentSlide={currentSlide} onNavigate={navigateTo} />
      <ConversionRail
        onOpenForm={() => setFormOpen(true)}
        onOpenDemo={() => openModal("modal-demo-dashboard")}
        onNavigate={navigateTo}
      />
      <DiagnosticoForm open={formOpen} onOpenChange={setFormOpen} />
      <WebDeckModals activeModal={activeModal} onClose={() => setActiveModal(null)} />

      {/* Horizontal deck */}
      <div
        ref={deckRef}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth h-screen"
        style={{ scrollbarWidth: "none" }}
      >
        {/* S01 — HERO */}
        <SlideShell id="s01-hero" variant="gradient">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <Badge className="bg-accent/20 text-accent border-accent/30 mb-6 text-xs">FT Wellbeing OS — Método MTR-F</Badge>
            </motion.div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Risco psicossocial + bem-estar científico + execução:
              <span className="text-gradient-primary"> um sistema operacional</span>
            </h1>
            <p className="text-base md:text-lg text-[hsl(210_20%_70%)] mb-4 max-w-2xl leading-relaxed">
              COPSOQ III (Brasil) + Work Wellbeing Playbook + PERMA+V + MTR-F — Mensurar → Educar → Transformar → Evoluir.
            </p>
            <p className="text-sm text-[hsl(210_20%_55%)] mb-8">
              Não é campanha. É ciclo operacional com evidência, governança e relatórios.
            </p>
            <div className="flex flex-wrap gap-3">
              <CTA label="Agendar Demonstração (30 min)" onClick={() => setFormOpen(true)} />
              <CTA label="Entrar no Dashboard" variant="secondary" onClick={() => window.location.href = "/copsoq/q1/results/overview"} />
            </div>
            <TrustBadges items={["Sem exposição individual", "minCellSize aplicado", "Trilha auditável", "WCAG 2.2 AA"]} />
          </div>
        </SlideShell>

        {/* S02 — PROBLEMA */}
        <SlideShell id="s02-problema" variant="dark">
          <div className="max-w-3xl">
            <Badge className="bg-copsoq-pathos/20 text-copsoq-pathos border-copsoq-pathos/30 mb-6 text-xs">O problema</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">A crise é sistêmica — e a resposta precisa ser sistêmica</h2>
            <p className="text-[hsl(210_20%_70%)] text-base mb-6 max-w-2xl leading-relaxed">
              Adoecimento, queda de energia, conflitos, rotatividade e risco reputacional não se resolvem com ações isoladas.
            </p>
            <GlassCard>
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-copsoq-pathos shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-sm mb-2">Dados e regulamentação</p>
                  <p className="text-xs text-[hsl(210_20%_60%)]">Estatísticas de crise de saúde mental: <span className="text-accent font-mono">TBD</span> <em>(fonte obrigatória)</em></p>
                  <p className="text-xs text-[hsl(210_20%_60%)] mt-1">Pressões regulatórias: NR-1 / riscos psicossociais em vigor</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </SlideShell>

        {/* S03 — TESE (4 ciclos) */}
        <SlideShell id="s03-tese" variant="dark">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3 max-w-3xl">A tese: medir com rigor, educar por dados, transformar o sistema, evoluir com governança</h2>
            <p className="text-[hsl(210_20%_65%)] mb-8 text-sm">Indicador → decisão → ação → evidência → relatório.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: "Mensurar", icon: <Activity size={20} />, color: "text-cycle-mensurar", border: "border-cycle-mensurar/30", desc: "COPSOQ III como lente de riscos psicossociais e desenho do trabalho.", modal: "modal-mensurar" },
                { title: "Educar", icon: <BookOpen size={20} />, color: "text-cycle-educar", border: "border-cycle-educar/30", desc: "Trilhas e micropráticas derivadas dos dados.", modal: "modal-educar" },
                { title: "Transformar", icon: <Wrench size={20} />, color: "text-cycle-transformar", border: "border-cycle-transformar/30", desc: "Portfólio de intervenções priorizadas (ILI).", modal: "modal-transformar" },
                { title: "Evoluir", icon: <TrendingUp size={20} />, color: "text-cycle-evoluir", border: "border-cycle-evoluir/30", desc: "QBR, re-medição e relatórios ESG.", modal: "modal-evoluir" },
              ].map(p => (
                <GlassCard key={p.title} className={`${p.border} hover:bg-[hsl(210_25%_12%)] transition-colors cursor-pointer`}>
                  <div className={`${p.color} mb-3`}>{p.icon}</div>
                  <h3 className="font-bold text-sm mb-2">{p.title}</h3>
                  <p className="text-xs text-[hsl(210_20%_60%)] mb-3">{p.desc}</p>
                  <button onClick={() => openModal(p.modal)} className={`text-xs ${p.color} hover:underline flex items-center gap-1`}>
                    Entender <ChevronRight size={12} />
                  </button>
                </GlassCard>
              ))}
            </div>
          </div>
        </SlideShell>

        {/* S04 — FRAMEWORK */}
        <SlideShell id="s04-framework-geral" variant="accent">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">A engrenagem: MTR-F + ILI</h2>
            <p className="text-[hsl(210_20%_75%)] mb-6 text-base">MTR-F orienta a transição risco → florescimento. ILI prioriza com lógica transparente.</p>
            <div className="flex flex-wrap gap-3 mb-6">
              <CTA label="Ver MTR-F por dentro" variant="secondary" onClick={() => openModal("modal-mtrf")} />
              <CTA label="Como o ILI prioriza" variant="secondary" onClick={() => openModal("modal-ili")} />
            </div>
            <p className="text-xs text-[hsl(210_20%_55%)] italic">Nada de caixa-preta. Sem culpabilização individual: foco no sistema de trabalho.</p>
          </div>
        </SlideShell>

        {/* S05 — MENSURAR */}
        <SlideShell id="s05-mensurar" variant="dark">
          <div>
            <Badge className="bg-cycle-mensurar/20 text-cycle-mensurar border-cycle-mensurar/30 mb-6 text-xs">Mensurar</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">COPSOQ III aplicado com experiência premium</h2>
            <p className="text-[hsl(210_20%_70%)] mb-6 text-sm max-w-2xl">Saída dupla: mapa de risco (dor sistêmica) + mapa de alavancas (transição).</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GlassCard>
                <Lock className="text-primary mb-3" size={20} />
                <h3 className="font-bold text-sm mb-2">Sigilo e agregação</h3>
                <p className="text-xs text-[hsl(210_20%_60%)] mb-3">Resultados apenas agregados com minCellSize.</p>
                <button onClick={() => openModal("modal-privacidade")} className="text-xs text-primary hover:underline flex items-center gap-1">Como protegemos <ChevronRight size={12} /></button>
              </GlassCard>
              <GlassCard>
                <Zap className="text-accent mb-3" size={20} />
                <h3 className="font-bold text-sm mb-2">Motor de survey (importável)</h3>
                <p className="text-xs text-[hsl(210_20%_60%)] mb-3">Banco de itens versionado; sem expor questionário.</p>
                <button onClick={() => openModal("modal-survey-engine")} className="text-xs text-accent hover:underline flex items-center gap-1">Como funciona <ChevronRight size={12} /></button>
              </GlassCard>
            </div>
          </div>
        </SlideShell>

        {/* S06 — MTR-F */}
        <SlideShell id="s06-mtrf" variant="dark">
          <div className="max-w-3xl">
            <Badge className="bg-primary/20 text-primary border-primary/30 mb-6 text-xs">MTR-F</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Mapa 2D que vira decisão em 60 segundos</h2>
            <p className="text-[hsl(210_20%_70%)] mb-6 text-sm">Risco (COPSOQ) × recursos (Playbook + PERMA+V). Zonas com padrões e leitura textual (A11Y).</p>
            {/* Visual placeholder MTR-F */}
            <GlassCard className="relative overflow-hidden">
              <div className="grid grid-cols-3 gap-0.5 aspect-[2/1]">
                <div className="bg-copsoq-salus/20 rounded-tl-lg flex items-center justify-center p-3">
                  <span className="text-[10px] text-copsoq-salus font-bold text-center">SALUS<br/>Baixo risco</span>
                </div>
                <div className="bg-copsoq-prevencao/20 flex items-center justify-center p-3">
                  <span className="text-[10px] text-copsoq-prevencao font-bold text-center">PREVENÇÃO<br/>Risco moderado</span>
                </div>
                <div className="bg-copsoq-pathos/20 rounded-tr-lg flex items-center justify-center p-3">
                  <span className="text-[10px] text-copsoq-pathos font-bold text-center">PATHOS<br/>Alto risco</span>
                </div>
              </div>
              <div className="flex justify-between mt-3 text-[10px] text-[hsl(210_20%_50%)]">
                <span>← Florescimento (Playbook + PERMA+V)</span>
                <span>Risco (COPSOQ) →</span>
              </div>
            </GlassCard>
            <div className="mt-4">
              <CTA label="Ver exemplo visual completo" variant="secondary" onClick={() => openModal("modal-mtrf-visual")} />
            </div>
          </div>
        </SlideShell>

        {/* S07 — PLAYBOOK */}
        <SlideShell id="s07-playbook" variant="dark">
          <div>
            <Badge className="bg-accent/20 text-accent border-accent/30 mb-6 text-xs">Evidência</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">12 drivers do Work Wellbeing Playbook</h2>
            <p className="text-[hsl(210_20%_70%)] mb-6 text-sm max-w-2xl">Ações orientadas por drivers e estruturadas para execução.</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {["Achievement","Appreciation","Compensation","Energy","Flexibility","Inclusion","Learning","Management","Purpose","Stress","Support","Trust"].map(d => (
                <Badge key={d} variant="outline" className="border-accent/20 text-accent/80 text-[11px]">{d}</Badge>
              ))}
            </div>
            <CTA label="Ver drivers e exemplos" variant="secondary" onClick={() => openModal("modal-playbook-drivers")} />
          </div>
        </SlideShell>

        {/* S08 — EDUCAR */}
        <SlideShell id="s08-educar" variant="dark">
          <div className="max-w-3xl">
            <Badge className="bg-cycle-educar/20 text-cycle-educar border-cycle-educar/30 mb-6 text-xs">Educar</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trilhas que nascem do diagnóstico</h2>
            <p className="text-[hsl(210_20%_70%)] mb-6 text-sm">Design instrucional de precisão: microlearning + prática guiada + evidência de transferência.</p>
            <GlassCard className="border-cycle-educar/20">
              <p className="text-xs text-[hsl(210_20%_60%)]">Cada trilha responde a um gap real. A evidência de aprendizado alimenta relatório e governança (sem exposição individual).</p>
            </GlassCard>
            <div className="mt-4">
              <CTA label="Exemplo de trilha" variant="secondary" onClick={() => openModal("modal-exemplo-trilha")} />
            </div>
          </div>
        </SlideShell>

        {/* S09 — TRANSFORMAR */}
        <SlideShell id="s09-transformar" variant="dark">
          <div className="max-w-3xl">
            <Badge className="bg-cycle-transformar/20 text-cycle-transformar border-cycle-transformar/30 mb-6 text-xs">Transformar</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Mexer no sistema de trabalho (não só palestras)</h2>
            <p className="text-[hsl(210_20%_70%)] mb-6 text-sm">Backlog priorizado (ILI) com donos, prazos, evidências e acompanhamento.</p>
            <GlassCard className="border-cycle-transformar/20">
              <div className="space-y-2">
                {["Redesenho carga/alocação","Clarificação papéis/critérios","Protocolo antiassédio","Rotinas peer support","Rituais alinhamento","Reconhecimento estruturado"].map(i => (
                  <div key={i} className="flex items-center gap-2 text-xs text-[hsl(210_20%_70%)]">
                    <CheckCircle2 size={12} className="text-cycle-transformar shrink-0" /> {i}
                  </div>
                ))}
              </div>
            </GlassCard>
            <div className="mt-4">
              <CTA label="Ver backlog (ILI)" variant="secondary" onClick={() => openModal("modal-backlog-ili")} />
            </div>
          </div>
        </SlideShell>

        {/* S10 — EVOLUIR */}
        <SlideShell id="s10-evoluir" variant="dark">
          <div className="max-w-3xl">
            <Badge className="bg-cycle-evoluir/20 text-cycle-evoluir border-cycle-evoluir/30 mb-6 text-xs">Evoluir</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">QBR + re-medição + ESG trimestral</h2>
            <p className="text-[hsl(210_20%_70%)] mb-6 text-sm">Evidência → decisão → execução → evidência (ciclo contínuo).</p>
            <CTA label="Ver estrutura do relatório" variant="secondary" onClick={() => openModal("modal-relatorio-esg")} />
          </div>
        </SlideShell>

        {/* S11 — ILI EQUATION */}
        <SlideShell id="s11-ili" variant="dark">
          <div className="max-w-3xl text-center mx-auto">
            <Badge className="bg-accent/20 text-accent border-accent/30 mb-6 text-xs">Priorização</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">ILI: priorização transparente</h2>
            <GlassCard className="border-accent/20 py-8">
              <p className="text-2xl md:text-4xl font-mono font-bold text-accent tracking-wide mb-6">
                ILI = (S×U×E×N×A) / (C×T×F)
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-[hsl(210_20%_60%)]">
                <div><span className="font-bold text-accent">S</span> Severidade</div>
                <div><span className="font-bold text-accent">U</span> Urgência</div>
                <div><span className="font-bold text-accent">E</span> Evidência</div>
                <div><span className="font-bold text-accent">N</span> P. normativa</div>
                <div><span className="font-bold text-accent">A</span> Aderência</div>
                <div><span className="font-bold text-accent">C</span> Custo</div>
                <div><span className="font-bold text-accent">T</span> Tempo</div>
                <div><span className="font-bold text-accent">F</span> Fricção</div>
              </div>
            </GlassCard>
            <div className="mt-6">
              <CTA label="Entender variáveis" variant="secondary" onClick={() => openModal("modal-ili-detalhe")} />
            </div>
          </div>
        </SlideShell>

        {/* S12 — CONFORMIDADE */}
        <SlideShell id="s12-conformidade-esg" variant="dark">
          <div className="max-w-3xl">
            <Badge className="bg-primary/20 text-primary border-primary/30 mb-6 text-xs">Compliance & ESG</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Conformidade e ESG humano</h2>
            <p className="text-[hsl(210_20%_70%)] mb-6 text-sm">Prontidão documental e governança — não "conformidade automática".</p>
            <GlassCard>
              <div className="space-y-2">
                {["Campanhas e agregados rastreáveis","Trilhas de evidências para auditoria","Backlog com dono, prazo e status","QBR com prestação de contas"].map(i => (
                  <div key={i} className="flex items-center gap-2 text-xs text-[hsl(210_20%_70%)]">
                    <ShieldCheck size={12} className="text-primary shrink-0" /> {i}
                  </div>
                ))}
              </div>
            </GlassCard>
            <div className="mt-4">
              <CTA label="Ver trilha de evidências" variant="secondary" onClick={() => openModal("modal-evidencias")} />
            </div>
          </div>
        </SlideShell>

        {/* S13 — IMPLANTAÇÃO */}
        <SlideShell id="s13-implantacao" variant="dark">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">90 dias para pilotar, 12 meses para institucionalizar</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[
                { phase: "0–30 dias", name: "Preparação & Mensurar", items: ["Governança e escopo","Aplicação diagnóstica","Linha de base","Hotspots e hipóteses"], color: "border-cycle-mensurar/30" },
                { phase: "31–60 dias", name: "Educar + Portfólio", items: ["Trilhas orientadas","Priorização ILI","Plano de intervenção","Protocolos"], color: "border-cycle-educar/30" },
                { phase: "61–90 dias", name: "Transformar + Evoluir", items: ["Execução inicial","Evidências","QBR","Relatório ESG Q1"], color: "border-cycle-transformar/30" },
              ].map(p => (
                <GlassCard key={p.phase} className={p.color}>
                  <p className="text-xs text-accent font-bold mb-1">{p.phase}</p>
                  <h3 className="font-bold text-sm mb-3">{p.name}</h3>
                  <div className="space-y-1.5">
                    {p.items.map(i => (
                      <div key={i} className="flex items-center gap-2 text-xs text-[hsl(210_20%_65%)]">
                        <CheckCircle2 size={11} className="text-primary shrink-0" /> {i}
                      </div>
                    ))}
                  </div>
                </GlassCard>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <CTA label="Proposta de Piloto (90 dias)" onClick={() => setFormOpen(true)} />
              <CTA label="Programa Anual (12 meses)" variant="secondary" onClick={() => setFormOpen(true)} />
            </div>
          </div>
        </SlideShell>

        {/* S14 — FECHAMENTO */}
        <SlideShell id="s14-fechamento" variant="gradient">
          <div className="max-w-3xl text-center mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Bem-estar não é benefício: é infraestrutura de performance e governança</h2>
            <p className="text-[hsl(210_20%_70%)] mb-8 text-base">Evidência, execução e rastreabilidade — comece agora.</p>
            <div className="flex flex-wrap gap-3 justify-center mb-6">
              <CTA label="Agendar Demonstração" onClick={() => setFormOpen(true)} />
              <CTA label="Entrar no Dashboard" variant="secondary" onClick={() => window.location.href = "/copsoq/q1/results/overview"} />
              <CTA label="Simular investimento" variant="secondary" onClick={() => navigateTo("s16-simulador-preco")} />
            </div>
            <TrustBadges items={["Sem exposição individual", "minCellSize aplicado", "Trilha auditável"]} />
          </div>
        </SlideShell>

        {/* S15 — DEMO DASHBOARD */}
        <SlideShell id="s15-demo-dashboard" variant="dark">
          <div className="max-w-3xl">
            <Badge className="bg-primary/20 text-primary border-primary/30 mb-6 text-xs">Demo</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Veja a Demo do Dashboard</h2>
            <p className="text-[hsl(210_20%_70%)] mb-6 text-sm">Visão executiva de risco + MTR-F + ações (sem expor indivíduos).</p>
            <GlassCard className="border-primary/20 mb-6">
              <div className="aspect-video rounded-lg bg-[hsl(210_25%_8%)] flex items-center justify-center border border-dashed border-[hsl(210_20%_20%)]">
                <div className="text-center">
                  <Play className="text-primary mx-auto mb-3" size={40} />
                  <p className="text-sm text-[hsl(210_20%_50%)]">Dashboard demonstrativo (dados fictícios)</p>
                </div>
              </div>
            </GlassCard>
            <div className="flex flex-wrap gap-3">
              <CTA label="Entrar no Dashboard" onClick={() => window.location.href = "/copsoq/q1/results/overview"} />
              <CTA label="O que você verá" variant="secondary" onClick={() => openModal("modal-demo-o-que-ver")} />
            </div>
          </div>
        </SlideShell>

        {/* S16 — SIMULADOR DE PREÇO */}
        <SlideShell id="s16-simulador-preco" variant="dark">
          <div className="max-w-5xl mx-auto w-full">
            <Badge className="bg-accent/20 text-accent border-accent/30 mb-4 text-xs">Simulador SaaS</Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-1">Simule seu investimento</h2>
            <p className="text-[hsl(210_20%_55%)] mb-6 text-xs">Preço por pessoa com descontos progressivos por volume. Transparente e sem surpresas.</p>
            <PricingSimulator onRequestProposal={() => setFormOpen(true)} />
            <div className="mt-4 text-center">
              <button onClick={() => openModal("modal-preco-metodo")} className="text-xs text-[hsl(210_20%_50%)] hover:text-[hsl(210_20%_80%)] hover:underline inline-flex items-center gap-1">
                <Eye size={12} /> Como calculamos (transparência)
              </button>
            </div>
          </div>
        </SlideShell>

        {/* S17 — FINAL CTA */}
        <SlideShell id="s17-agendar-fechamento" variant="gradient">
          <div className="max-w-3xl text-center mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Comece com Q1 COPSOQ — 90 dias</h2>
            <p className="text-[hsl(210_20%_70%)] mb-8 text-base max-w-xl mx-auto">
              Blindagem & Consolidação: mensure com rigor, eduque por dados, transforme o sistema de trabalho e gere evidências ESG.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mb-6">
              <CTA label="Agendar Demonstração (30 min)" onClick={() => setFormOpen(true)} />
              <Button variant="outline" className="border-[hsl(210_20%_22%)] text-[hsl(210_20%_80%)] gap-2">
                <FileText size={16} /> Baixar resumo executivo (TBD)
              </Button>
            </div>
            <TrustBadges items={["Sem exposição individual", "minCellSize aplicado", "Trilha auditável", "Acessibilidade WCAG 2.2 AA"]} />
          </div>
        </SlideShell>
      </div>
    </div>
  );
}

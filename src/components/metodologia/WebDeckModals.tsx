import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, BookOpen, Wrench, TrendingUp, BarChart3, Calculator, Lock, Cog, Eye, Layers, FileText, ClipboardList, Search } from "lucide-react";
import { ReactNode } from "react";

interface ModalDef {
  id: string;
  title: string;
  icon: ReactNode;
  content: string[];
}

const MODALS: ModalDef[] = [
  { id: "modal-mensurar", title: "Mensurar (COPSOQ III)", icon: <Search size={20} />, content: [
    "Objetivo: mapear riscos psicossociais e desenho do trabalho com evidência acionável.",
    "Experiência: chatbot + survey acessível; salvamento de progresso; linguagem clara.",
    "Saída: agregados, hotspots e hipóteses organizacionais (sem causalidade automática)."
  ]},
  { id: "modal-educar", title: "Educar — trilhas por dados", icon: <BookOpen size={20} />, content: [
    "Trilhas nascem dos gaps do diagnóstico (sem conteúdo genérico).",
    "Microlearning + prática guiada + evidência mínima de transferência.",
    "Resultados agregados alimentam governança e relatório."
  ]},
  { id: "modal-transformar", title: "Transformar — sistema de trabalho", icon: <Wrench size={20} />, content: [
    "Backlog de intervenções priorizado por ILI (explicável).",
    "Execução com dono, prazo, evidências e revisão.",
    "Sem culpabilização individual: foco em processo, carga, autonomia, suporte e rituais."
  ]},
  { id: "modal-evoluir", title: "Evoluir — QBR e relatórios", icon: <TrendingUp size={20} />, content: [
    "Cadência executiva (QBR) para decisões e prestação de contas.",
    "Re-medição planejada para validar mudanças e ajustar priorização.",
    "Relatório trimestral ESG + trilha de evidências."
  ]},
  { id: "modal-mtrf", title: "MTR-F — Matriz Risco-Florescimento", icon: <BarChart3 size={20} />, content: [
    "Mapa 2D: risco psicossocial (COPSOQ) × recursos (drivers do Playbook + proxy PERMA+V).",
    "Zonas com padrões e ícones (não depender só de cor).",
    "Painel de recomendações: drivers, trilhas e intervenções."
  ]},
  { id: "modal-ili", title: "ILI — Índice Lógico de Intervenções", icon: <Calculator size={20} />, content: [
    "Fórmula explicável: severidade, urgência, evidência, pressão normativa, aderência vs custo, tempo e fricção.",
    "Não substitui governança: é suporte à decisão."
  ]},
  { id: "modal-privacidade", title: "Privacidade e segurança (LGPD)", icon: <Lock size={20} />, content: [
    "Sem exposição individual em dashboards.",
    "Agregação e minCellSize aplicados.",
    "Audit log e evidências para governança."
  ]},
  { id: "modal-survey-engine", title: "Motor de survey (item bank)", icon: <Cog size={20} />, content: [
    "Questionário carregado como item bank versionado (não hardcoded).",
    "Permite evolução, revisão e auditoria do instrumento.",
    "Evita exposição do instrumento completo na camada cliente."
  ]},
  { id: "modal-mtrf-visual", title: "MTR-F — visual premium e acessível", icon: <Eye size={20} />, content: [
    "Mapa 2D com zonas por padrões + ícones.",
    "Fallback em tabela + resumo textual automático para leitores de tela.",
    "Respeita prefers-reduced-motion."
  ]},
  { id: "modal-playbook-drivers", title: "Playbook — 12 drivers", icon: <Layers size={20} />, content: [
    "Drivers: Stress, Support, Management, Trust, Purpose, Flexibility, Achievement, Appreciation, Compensation, Energy, Inclusion & Belonging, Learning.",
    "Cada driver ativa trilhas e intervenções no backlog.",
    "Execução orientada por evidências e governança."
  ]},
  { id: "modal-exemplo-trilha", title: "Exemplo de trilha (Educar)", icon: <BookOpen size={20} />, content: [
    "Módulos curtos, prática guiada, checklist e evidência mínima.",
    "Sem moralismo: linguagem de trabalho real e segurança psicológica."
  ]},
  { id: "modal-backlog-ili", title: "Backlog priorizado (ILI)", icon: <ClipboardList size={20} />, content: [
    "Kanban com status (planned/in progress/done/blocked), dono, prazo e evidências.",
    "Priorização explicável; decisões registradas."
  ]},
  { id: "modal-relatorio-esg", title: "Relatório ESG trimestral", icon: <FileText size={20} />, content: [
    "Sumário executivo, KPIs, decisões/ações, evidências anexas, trilha de auditoria.",
    "Sem prometer conformidade automática: prontidão documental e governança."
  ]},
  { id: "modal-evidencias", title: "Catálogo de evidências", icon: <Shield size={20} />, content: [
    "Campanha, agregados, trilhas, backlog, QBR, políticas e comunicações.",
    "Tudo com audit log e referências."
  ]},
  { id: "modal-ili-detalhe", title: "ILI — variáveis (detalhe)", icon: <Calculator size={20} />, content: [
    "S: severidade | U: urgência | E: evidência | N: pressão normativa | A: aderência",
    "C: custo | T: tempo | F: fricção",
    "Objetivo: transparência e consenso para execução."
  ]},
  { id: "modal-preco-metodo", title: "Transparência do simulador", icon: <Calculator size={20} />, content: [
    "Calcula faixa orientativa: porte, modalidade, completude e requisitos enterprise.",
    "Valores base são configuráveis e TBD quando não definidos.",
    "Proposta final validada na demonstração."
  ]},
  { id: "modal-demo-o-que-ver", title: "O que você verá na demo", icon: <Eye size={20} />, content: [
    "1) KPI strip com leitura executiva",
    "2) Heatmap de hotspots (com fallback em lista)",
    "3) MTR-F 2D com zonas por padrões e painel de recomendações",
    "4) Backlog (ILI) com evidências e governança"
  ]},
];

interface WebDeckModalsProps {
  activeModal: string | null;
  onClose: () => void;
}

export default function WebDeckModals({ activeModal, onClose }: WebDeckModalsProps) {
  const modal = MODALS.find(m => m.id === activeModal);
  if (!modal) return null;

  return (
    <Dialog open={!!activeModal} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md bg-[hsl(210_25%_10%)] border-[hsl(210_20%_18%)] text-[hsl(210_20%_95%)]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-base">
            <span className="text-accent">{modal.icon}</span>
            {modal.title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          {modal.content.map((line, i) => (
            <p key={i} className="text-sm text-[hsl(210_20%_75%)] leading-relaxed">{line}</p>
          ))}
        </div>
        <Button variant="ghost" onClick={onClose} className="mt-2 text-[hsl(210_20%_60%)]">Fechar</Button>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, ChevronLeft, ChevronRight, Shield } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const STEPS = [
  { id: "identificacao", title: "Quem você é" },
  { id: "contexto", title: "Contexto" },
  { id: "maturidade", title: "Maturidade" },
  { id: "agenda", title: "Agendar" },
];

const NR1_LABELS = ["Inexistente", "Inicial", "Parcial", "Estruturado", "Auditável"];
const DIGITAL_LABELS = ["Muito baixa", "Baixa", "Média", "Alta", "Muito alta"];

interface DiagnosticoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DiagnosticoForm({ open, onOpenChange }: DiagnosticoFormProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    nome: "", email: "", cargo: "", organizacao: "",
    segmento: "", porte: "", principal_dor: "", urgencia: "",
    nr1_maturidade: [2], maturidade_digital: [3],
    janela_reuniao: "", mensagem: "",
  });

  const update = (field: string, value: any) => setData(prev => ({ ...prev, [field]: value }));

  const canAdvance = () => {
    switch (step) {
      case 0: return data.nome && data.email && data.cargo && data.organizacao;
      case 1: return data.segmento && data.porte && data.principal_dor && data.urgencia;
      case 2: return true;
      case 3: return data.janela_reuniao;
      default: return false;
    }
  };

  const handleSubmit = () => {
    toast({ title: "Solicitação enviada!", description: "Entraremos em contato em breve com seu roadmap inicial." });
    onOpenChange(false);
    setStep(0);
  };

  const inputClass = "bg-[hsl(210_20%_15%)] border-[hsl(210_20%_22%)] text-[hsl(210_20%_95%)] placeholder:text-[hsl(210_20%_40%)]";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-[hsl(210_25%_10%)] border-[hsl(210_20%_18%)] text-[hsl(210_20%_95%)] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-lg font-bold">Agendar Demonstração + Diagnóstico</DialogTitle>
        </DialogHeader>

        {/* Step indicator */}
        <div className="px-6 pt-4 flex gap-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex-1 flex flex-col items-center gap-1">
              <div className={`h-1 w-full rounded-full transition-colors ${i <= step ? "bg-accent" : "bg-[hsl(210_20%_20%)]"}`} />
              <span className="text-[10px] text-[hsl(210_20%_50%)]">{s.title}</span>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="px-6 py-4 space-y-4 min-h-[280px]"
          >
            {step === 0 && (
              <>
                <Input placeholder="Seu nome" value={data.nome} onChange={e => update("nome", e.target.value)} className={inputClass} />
                <Input placeholder="E-mail" type="email" value={data.email} onChange={e => update("email", e.target.value)} className={inputClass} />
                <Input placeholder="Cargo" value={data.cargo} onChange={e => update("cargo", e.target.value)} className={inputClass} />
                <Input placeholder="Organização" value={data.organizacao} onChange={e => update("organizacao", e.target.value)} className={inputClass} />
              </>
            )}

            {step === 1 && (
              <>
                <Select value={data.segmento} onValueChange={v => update("segmento", v)}>
                  <SelectTrigger className={inputClass}><SelectValue placeholder="Tipo de organização" /></SelectTrigger>
                  <SelectContent>
                    {["Empresa","Educação","Governo","Hospitalar","OSC","Comunidade"].map(s => <SelectItem key={s} value={s.toLowerCase()}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={data.porte} onValueChange={v => update("porte", v)}>
                  <SelectTrigger className={inputClass}><SelectValue placeholder="Porte" /></SelectTrigger>
                  <SelectContent>
                    {[["ate_100","Até 100"],["101_500","101–500"],["501_2000","501–2.000"],["2000_plus","2.000+"]].map(([v,l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Textarea placeholder="Principal dor / desafio" value={data.principal_dor} onChange={e => update("principal_dor", e.target.value)} className={inputClass} rows={3} />
                <Select value={data.urgencia} onValueChange={v => update("urgencia", v)}>
                  <SelectTrigger className={inputClass}><SelectValue placeholder="Urgência" /></SelectTrigger>
                  <SelectContent>
                    {[["imediata","Imediata"],["ate_3_meses","Até 3 meses"],["ate_6_meses","Até 6 meses"],["explorando","Explorando"]].map(([v,l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-3">
                  <label className="text-sm font-medium">NR-1 / GRO-PGR (0–4)</label>
                  <Slider value={data.nr1_maturidade} onValueChange={v => update("nr1_maturidade", v)} min={0} max={4} step={1} className="py-2" />
                  <div className="flex justify-between text-[10px] text-[hsl(210_20%_50%)]">
                    {NR1_LABELS.map(l => <span key={l}>{l}</span>)}
                  </div>
                </div>
                <div className="space-y-3 mt-6">
                  <label className="text-sm font-medium">Maturidade digital (1–5)</label>
                  <Slider value={data.maturidade_digital} onValueChange={v => update("maturidade_digital", v)} min={1} max={5} step={1} className="py-2" />
                  <div className="flex justify-between text-[10px] text-[hsl(210_20%_50%)]">
                    {DIGITAL_LABELS.map(l => <span key={l}>{l}</span>)}
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <Select value={data.janela_reuniao} onValueChange={v => update("janela_reuniao", v)}>
                  <SelectTrigger className={inputClass}><SelectValue placeholder="Quando quer agendar?" /></SelectTrigger>
                  <SelectContent>
                    {[["7_dias","Próximos 7 dias"],["14_dias","Próximos 14 dias"],["30_dias","Próximos 30 dias"]].map(([v,l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Textarea placeholder="Observações (opcional)" value={data.mensagem} onChange={e => update("mensagem", e.target.value)} className={inputClass} rows={3} />
                <div className="flex items-start gap-2 text-[11px] text-[hsl(210_20%_50%)] bg-[hsl(210_20%_12%)] rounded-lg p-3">
                  <Shield size={14} className="shrink-0 mt-0.5 text-accent" />
                  Dados usados apenas para contato e desenho do roadmap. Sem coleta clínica individual.
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="px-6 pb-6 flex gap-3 justify-between">
          <Button
            variant="ghost"
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            className="text-[hsl(210_20%_70%)]"
          >
            <ChevronLeft size={16} /> Voltar
          </Button>

          {step < 3 ? (
            <Button onClick={() => setStep(s => s + 1)} disabled={!canAdvance()} className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
              Avançar <ChevronRight size={16} />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!canAdvance()} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              <Check size={16} /> Enviar solicitação
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

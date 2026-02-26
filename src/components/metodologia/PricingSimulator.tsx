import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle } from "lucide-react";

const SEGMENTOS = [
  { value: "empresa", label: "Empresa" },
  { value: "educacao", label: "Educação" },
  { value: "governo", label: "Governo" },
  { value: "hospitalar", label: "Hospitalar" },
  { value: "osc", label: "OSC" },
  { value: "comunidade", label: "Comunidade" },
];

const PORTES = [
  { value: "ate_100", label: "Até 100 colaboradores" },
  { value: "101_500", label: "101–500" },
  { value: "501_2000", label: "501–2.000" },
  { value: "2000_plus", label: "2.000+" },
];

const MODALIDADES = [
  { value: "sprint_90_dias", label: "Sprint 90 dias" },
  { value: "programa_anual", label: "Programa Anual (12 meses)" },
];

const COMPLETUDES = [
  { value: "core", label: "Core (Mensurar + Resultados)" },
  { value: "core_plus", label: "Core+ (+ Educar + Transformar)" },
  { value: "full_stack", label: "Full Stack (+ Evoluir + ESG)" },
];

const ADDONS = [
  { id: "sso", label: "SSO / SAML" },
  { id: "integracoes", label: "Integrações (ERP/HCM)" },
  { id: "multiunidade", label: "Multiunidade" },
  { id: "relatorios_avancados", label: "Relatórios avançados" },
  { id: "cs_dedicado", label: "CS dedicado" },
];

interface PricingSimulatorProps {
  onRequestProposal: () => void;
}

export default function PricingSimulator({ onRequestProposal }: PricingSimulatorProps) {
  const [segmento, setSegmento] = useState("");
  const [porte, setPorte] = useState("");
  const [modalidade, setModalidade] = useState("");
  const [completude, setCompletude] = useState("");
  const [addons, setAddons] = useState<string[]>([]);
  const [simulated, setSimulated] = useState(false);

  const toggleAddon = (id: string) => {
    setAddons(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const isComplete = segmento && porte && modalidade && completude;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-[hsl(210_20%_70%)]">Segmento</label>
          <Select value={segmento} onValueChange={setSegmento}>
            <SelectTrigger className="bg-[hsl(210_20%_15%)] border-[hsl(210_20%_22%)] text-[hsl(210_20%_95%)]">
              <SelectValue placeholder="Tipo de organização" />
            </SelectTrigger>
            <SelectContent>
              {SEGMENTOS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-[hsl(210_20%_70%)]">Porte</label>
          <Select value={porte} onValueChange={setPorte}>
            <SelectTrigger className="bg-[hsl(210_20%_15%)] border-[hsl(210_20%_22%)] text-[hsl(210_20%_95%)]">
              <SelectValue placeholder="Nº de colaboradores" />
            </SelectTrigger>
            <SelectContent>
              {PORTES.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-[hsl(210_20%_70%)]">Modalidade</label>
          <Select value={modalidade} onValueChange={setModalidade}>
            <SelectTrigger className="bg-[hsl(210_20%_15%)] border-[hsl(210_20%_22%)] text-[hsl(210_20%_95%)]">
              <SelectValue placeholder="Sprint ou Anual" />
            </SelectTrigger>
            <SelectContent>
              {MODALIDADES.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-[hsl(210_20%_70%)]">Completude</label>
          <Select value={completude} onValueChange={setCompletude}>
            <SelectTrigger className="bg-[hsl(210_20%_15%)] border-[hsl(210_20%_22%)] text-[hsl(210_20%_95%)]">
              <SelectValue placeholder="Módulos inclusos" />
            </SelectTrigger>
            <SelectContent>
              {COMPLETUDES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-medium text-[hsl(210_20%_70%)]">Add-ons (opcionais)</label>
        <div className="flex flex-wrap gap-3">
          {ADDONS.map(a => (
            <label key={a.id} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={addons.includes(a.id)}
                onCheckedChange={() => toggleAddon(a.id)}
                className="border-[hsl(210_20%_30%)]"
              />
              <span className="text-xs text-[hsl(210_20%_80%)]">{a.label}</span>
            </label>
          ))}
        </div>
      </div>

      <Button
        onClick={() => setSimulated(true)}
        disabled={!isComplete}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
      >
        Simular faixa de investimento
      </Button>

      {simulated && isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-accent/30 bg-accent/5 p-6 space-y-4"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-accent mt-0.5 shrink-0" size={18} />
            <div className="space-y-2">
              <p className="text-sm font-semibold text-accent">Faixa estimativa (TBD)</p>
              <p className="text-xs text-[hsl(210_20%_70%)]">
                As faixas de preço ainda não estão configuradas (TBD). A proposta final depende de escopo, integrações e governança, e será validada na demonstração.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-[hsl(210_20%_22%)] text-[hsl(210_20%_80%)] text-[11px]">{SEGMENTOS.find(s => s.value === segmento)?.label}</Badge>
            <Badge variant="outline" className="border-[hsl(210_20%_22%)] text-[hsl(210_20%_80%)] text-[11px]">{PORTES.find(p => p.value === porte)?.label}</Badge>
            <Badge variant="outline" className="border-[hsl(210_20%_22%)] text-[hsl(210_20%_80%)] text-[11px]">{MODALIDADES.find(m => m.value === modalidade)?.label}</Badge>
            <Badge variant="outline" className="border-[hsl(210_20%_22%)] text-[hsl(210_20%_80%)] text-[11px]">{COMPLETUDES.find(c => c.value === completude)?.label}</Badge>
            {addons.map(a => (
              <Badge key={a} variant="outline" className="border-accent/30 text-accent text-[11px]">+{ADDONS.find(x => x.id === a)?.label}</Badge>
            ))}
          </div>

          <p className="text-[10px] text-[hsl(210_20%_50%)] italic">
            Estimativa orientativa. A proposta final depende de escopo, integrações e governança. Validada na demonstração.
          </p>

          <Button onClick={onRequestProposal} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            Solicitar proposta com base na simulação
          </Button>
        </motion.div>
      )}
    </div>
  );
}

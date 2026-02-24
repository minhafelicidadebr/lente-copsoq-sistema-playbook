import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Trash2, ArrowRight, AlertTriangle } from "lucide-react";

interface Segment {
  name: string;
  criteria: string;
  headcount: string;
}

export default function OnboardWorkforce() {
  const [step, setStep] = useState(0);
  const [segments, setSegments] = useState<Segment[]>([{ name: "", criteria: "", headcount: "" }]);
  const navigate = useNavigate();

  const addSegment = () => setSegments((s) => [...s, { name: "", criteria: "", headcount: "" }]);
  const removeSegment = (i: number) => setSegments((s) => s.filter((_, idx) => idx !== i));
  const updateSegment = (i: number, field: keyof Segment, value: string) =>
    setSegments((s) => s.map((seg, idx) => (idx === i ? { ...seg, [field]: value } : seg)));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mapa de Segmentos</h1>
        <p className="text-sm text-muted-foreground mt-1">Sem reidentificação — célula mínima ≥ 8 colaboradores</p>
      </div>

      <div className="flex items-center gap-3 bg-copsoq-prevencao/10 border border-copsoq-prevencao/30 rounded-lg p-4">
        <AlertTriangle className="h-5 w-5 text-copsoq-prevencao flex-shrink-0" />
        <p className="text-sm text-foreground">
          Critérios de segmentação nunca devem permitir reidentificação. Evite rótulos sensíveis (gênero, etnia, etc.) e garanta headcount ≥ 8 por segmento.
        </p>
      </div>

      {step === 0 && (
        <Card className="border border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Segmentos da Força de Trabalho
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {segments.map((seg, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_120px_40px] gap-3 items-end p-4 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <Label className="text-xs">Nome do Segmento</Label>
                  <Input value={seg.name} onChange={(e) => updateSegment(i, "name", e.target.value)} placeholder="Ex: Operacional SP" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Critério</Label>
                  <Input value={seg.criteria} onChange={(e) => updateSegment(i, "criteria", e.target.value)} placeholder="Ex: Unidade + Departamento" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Headcount</Label>
                  <Input type="number" value={seg.headcount} onChange={(e) => updateSegment(i, "headcount", e.target.value)} placeholder="≥ 8" min={8} />
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeSegment(i)} disabled={segments.length === 1} className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addSegment}>
              <Plus className="mr-2 h-4 w-4" /> Adicionar Segmento
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 1 && (
        <Card className="border border-border shadow-card">
          <CardHeader>
            <CardTitle>Configuração da Campanha COPSOQ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Início da Campanha</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Fim da Campanha</Label>
                <Input type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Política de Lembretes</Label>
              <Select><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Padrão (dias 3, 7, 14, 19)</SelectItem>
                  <SelectItem value="gentle">Suave (dias 7, 14)</SelectItem>
                  <SelectItem value="aggressive">Intensivo (dias 2, 5, 10, 15, 19)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Canais</Label>
              <div className="flex flex-wrap gap-2">
                {["E-mail", "WhatsApp (opcional)", "Plataforma"].map(c => (
                  <Badge key={c} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1">{c}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(0)} disabled={step === 0}>Voltar</Button>
        <Button onClick={() => step === 0 ? setStep(1) : navigate("/copsoq/q1/results/overview")}>
          {step === 0 ? "Próximo" : "Ativar Campanha COPSOQ"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

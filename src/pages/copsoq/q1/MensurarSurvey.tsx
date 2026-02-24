import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ClipboardList, ChevronRight, ChevronLeft, CheckCircle2, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Placeholder items — real item bank would be loaded/seeded (R3)
const placeholderItems = [
  { itemId: "DEMO_01", dimensionId: "DEMANDAS_QUANTITATIVAS", prompt: "[Item COPSOQ — carregado via seed/upload]", helpText: "Este item avalia a quantidade de trabalho que você precisa realizar.", reverseScored: false },
  { itemId: "DEMO_02", dimensionId: "RITMO_DE_TRABALHO", prompt: "[Item COPSOQ — carregado via seed/upload]", helpText: "Este item avalia a velocidade com que você precisa trabalhar.", reverseScored: false },
  { itemId: "DEMO_03", dimensionId: "DEMANDAS_EMOCIONAIS", prompt: "[Item COPSOQ — carregado via seed/upload]", helpText: "Este item avalia o impacto emocional do seu trabalho.", reverseScored: false },
  { itemId: "DEMO_04", dimensionId: "INFLUENCIA_TRABALHO", prompt: "[Item COPSOQ — carregado via seed/upload]", helpText: "Este item avalia sua autonomia nas decisões de trabalho.", reverseScored: false },
  { itemId: "DEMO_05", dimensionId: "SIGNIFICADO_TRABALHO", prompt: "[Item COPSOQ — carregado via seed/upload]", helpText: "Este item avalia o quanto você sente que seu trabalho tem propósito.", reverseScored: false },
];

const likertOptions = [
  { value: "1", label: "Nunca / Quase nunca" },
  { value: "2", label: "Raramente" },
  { value: "3", label: "Às vezes" },
  { value: "4", label: "Frequentemente" },
  { value: "5", label: "Sempre" },
];

export default function MensurarSurvey() {
  const [currentItem, setCurrentItem] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const item = placeholderItems[currentItem];
  const progress = ((currentItem + 1) / placeholderItems.length) * 100;
  const isComplete = currentItem >= placeholderItems.length;

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <CheckCircle2 className="h-16 w-16 text-copsoq-salus mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Pesquisa enviada!</h1>
        <p className="text-muted-foreground text-center max-w-md">
          Obrigado por participar. Seus dados serão processados de forma agregada e confidencial.
          Os resultados estarão disponíveis no dashboard em breve.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-primary" />
          Pesquisa COPSOQ
        </h1>
        <p className="text-sm text-muted-foreground mt-1">COPSOQ III — Versão Padrão Brasileira (item bank)</p>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progresso</span>
          <span className="font-medium text-foreground">{currentItem + 1} / {placeholderItems.length}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="border border-border shadow-card">
        <CardContent className="p-6 space-y-6">
          <div>
            <Badge variant="secondary" className="mb-3 text-xs">{item.dimensionId.replace(/_/g, " ")}</Badge>
            <div className="flex items-start gap-2">
              <p className="text-base font-medium text-foreground leading-relaxed">{item.prompt}</p>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">{item.helpText}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-xs text-muted-foreground mt-2 italic">
              Nota (R3): Os itens reais são carregados via seed/upload do item bank COPSOQ III. Estes são placeholders.
            </p>
          </div>

          <RadioGroup
            value={answers[item.itemId] || ""}
            onValueChange={(val) => setAnswers((prev) => ({ ...prev, [item.itemId]: val }))}
            className="space-y-2"
          >
            {likertOptions.map((opt) => (
              <Label
                key={opt.value}
                htmlFor={`${item.itemId}-${opt.value}`}
                className="flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer hover:bg-muted transition-colors has-[:checked]:bg-primary/5 has-[:checked]:border-primary"
              >
                <RadioGroupItem value={opt.value} id={`${item.itemId}-${opt.value}`} />
                <span className="text-sm text-foreground">{opt.label}</span>
              </Label>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentItem((c) => Math.max(0, c - 1))} disabled={currentItem === 0}>
          <ChevronLeft className="mr-1 h-4 w-4" /> Anterior
        </Button>
        <Button
          onClick={() => setCurrentItem((c) => c + 1)}
          disabled={!answers[item.itemId]}
        >
          {currentItem < placeholderItems.length - 1 ? "Próximo" : "Enviar"}
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

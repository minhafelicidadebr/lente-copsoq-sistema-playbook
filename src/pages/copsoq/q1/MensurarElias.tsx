import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, HelpCircle, Shield, EyeOff, Users } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import eliasAvatar from "@/assets/elias-avatar.png";

interface Message {
  role: "elias" | "user";
  content: string;
  actions?: Action[];
}

interface Action {
  type: "badges" | "options";
  items: string[];
}

const helpItems = [
  { q: "Isso vai me expor?", a: "Não. Só mostramos resultados agregados com célula mínima de 8 pessoas." },
  { q: "Para que serve?", a: "Para orientar ações reais no trabalho, não só um relatório." },
  { q: "Posso parar?", a: "Sim. Você pode interromper a qualquer momento, sem prejuízo." },
];

const initialMessages: Message[] = [
  {
    role: "elias",
    content: "Oi! Eu sou o EliAs 🤖\n\nVou te acompanhar no COPSOQ — um diagnóstico para entender como o trabalho está afetando energia, demandas, relações e segurança psicológica.\n\nSuas respostas são confidenciais e serão analisadas apenas de forma agregada.",
    actions: [
      { type: "badges", items: ["Sem ranking", "Sem exposição individual", "Células mínimas"] },
      { type: "options", items: ["Sim, vamos começar", "Quero entender antes"] },
    ],
  },
];

export default function MensurarElias() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleOption = (option: string) => {
    const userMsg: Message = { role: "user", content: option };
    let eliasReply: Message;

    if (option === "Quero entender antes") {
      eliasReply = {
        role: "elias",
        content: "Perfeito! A ideia é simples:\n\n1️⃣ **Mensurar** — medimos o cenário psicossocial\n2️⃣ **Educar** — trilhas e ações sob medida\n3️⃣ **Transformar** — intervenções priorizadas por evidência\n4️⃣ **Evoluir** — governança e relatório ESG\n\nTudo com sigilo, sem ranking e com célula mínima. Agora sim: iniciamos a pesquisa?",
        actions: [{ type: "options", items: ["Sim, vamos começar"] }],
      };
    } else {
      eliasReply = {
        role: "elias",
        content: "Ótimo! 🎯\n\nAntes de começar, preciso que você confirme o **consentimento**. Suas respostas:\n\n• Serão analisadas de forma agregada\n• Não haverá ranking de pessoas ou equipes\n• Você pode interromper a qualquer momento\n\nAo prosseguir, você confirma que entendeu e concorda com os termos acima.",
        actions: [{ type: "options", items: ["Concordo e quero começar a pesquisa"] }],
      };
    }

    setMessages((prev) => [...prev, userMsg, eliasReply]);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input };
    const eliasReply: Message = {
      role: "elias",
      content: "Entendi sua pergunta! No momento, estou configurado para conduzir o fluxo de consentimento e a pesquisa COPSOQ. Se tiver dúvidas sobre privacidade ou a metodologia, clique no botão de ajuda (?) no canto superior direito.",
    };
    setMessages((prev) => [...prev, userMsg, eliasReply]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
        <div className="flex items-center gap-3">
          <img src={eliasAvatar} alt="EliAs" className="h-10 w-10 rounded-full ring-2 ring-primary/20" />
          <div>
            <h1 className="text-lg font-bold text-foreground">EliAs</h1>
            <p className="text-xs text-muted-foreground">Copiloto empático · Tom científico e prático</p>
          </div>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Perguntas Frequentes</SheetTitle>
            </SheetHeader>
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

      {/* Messages */}
      <ScrollArea className="flex-1 pr-2" ref={scrollRef}>
        <div className="space-y-4 pb-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "elias" && (
                <img src={eliasAvatar} alt="EliAs" className="h-8 w-8 rounded-full flex-shrink-0 mt-1" />
              )}
              <div className={`max-w-md space-y-3 ${msg.role === "user" ? "items-end" : ""}`}>
                <Card className={`px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground border-0"
                    : "bg-card border border-border"
                }`}>
                  <p className="text-sm whitespace-pre-line leading-relaxed">{msg.content}</p>
                </Card>
                {msg.actions?.map((action, j) => (
                  <div key={j} className="flex flex-wrap gap-2">
                    {action.type === "badges" &&
                      action.items.map((b) => (
                        <Badge key={b} variant="secondary" className="text-xs gap-1">
                          <Shield className="h-3 w-3" /> {b}
                        </Badge>
                      ))}
                    {action.type === "options" &&
                      action.items.map((o) => (
                        <Button key={o} variant="outline" size="sm" onClick={() => handleOption(o)} className="text-xs">
                          {o}
                        </Button>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border pt-4 mt-auto">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Pergunte ao EliAs..."
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

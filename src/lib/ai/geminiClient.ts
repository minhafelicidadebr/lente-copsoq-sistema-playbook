import type { ChatRequest, ChatResponse } from "./types";
import { getSystemPrompt } from "./prompts";

export async function geminiChat(req: ChatRequest): Promise<ChatResponse> {
  const system = getSystemPrompt({ role: req.context.userRole, axis: req.context.axis });

  const endpoint = (import.meta as any).env?.VITE_GEMINI_CHAT_ENDPOINT as string | undefined;

  if (endpoint) {
    const r = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...req, system }),
    });
    if (!r.ok) {
      return { text: `TBD (needs_backend): falha ao chamar endpoint (${r.status}).` };
    }
    return (await r.json()) as ChatResponse;
  }

  const last = req.messages.filter((m) => m.role === "user").slice(-1)[0]?.content ?? "";
  return {
    text:
      `TBD (needs_backend): integração Gemini 3.1 ainda não está ativa neste ambiente.\n\n` +
      `Eu posso, porém, estruturar sua solicitação para execução no app.\n` +
      `Pedido recebido: "${last.slice(0, 180)}"${last.length > 180 ? "…" : ""}\n\n` +
      `Próximo passo recomendado: definir o objetivo, restrições de privacidade e artefato desejado (ex.: backlog item, roteiro, checklist, prompt).`,
  };
}

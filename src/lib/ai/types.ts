import type { Axis, Role } from "@/lib/auth/types";

export type ChatRole = "system" | "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
  ts: number;
};

export type AssistantContext = {
  tenantId?: string;
  tenantName?: string;
  userId?: string;
  userRole?: Role;
  axis?: Axis;
  workspace?: string;
};

export type ChatRequest = {
  messages: ChatMessage[];
  context: AssistantContext;
};

export type ChatResponse = {
  text: string;
  citations?: Array<{ title: string; url: string; status: "PENDING" | "VERIFIED" }>;
  safety?: { refused?: boolean; reason?: string };
};

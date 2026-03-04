export type AuditEvent = {
  id: string;
  ts: number;
  actor?: { userId?: string; role?: string; tenantId?: string };
  action: string;
  target?: string;
  meta?: Record<string, unknown>;
  prevHash?: string;
  hash?: string;
};

const KEY = "ftos_audit_log_v1";

function safeParse<T>(v: string | null): T | null {
  if (!v) return null;
  try { return JSON.parse(v) as T; } catch { return null; }
}

async function sha256(input: string) {
  try {
    if (!crypto?.subtle) throw new Error("no_subtle");
    const data = new TextEncoder().encode(input);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    let h = 0;
    for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0;
    return `weak_${h.toString(16)}`;
  }
}

export function loadAudit(): AuditEvent[] {
  return safeParse<AuditEvent[]>(localStorage.getItem(KEY)) ?? [];
}

export async function appendAudit(evt: AuditEvent) {
  const prev = loadAudit();
  const prevHash = prev.slice(-1)[0]?.hash;
  const base: AuditEvent = { ...evt, prevHash };
  const hash = await sha256(JSON.stringify(base));
  const full: AuditEvent = { ...base, hash };
  const next = [...prev, full].slice(-20000);
  localStorage.setItem(KEY, JSON.stringify(next));
  return full;
}

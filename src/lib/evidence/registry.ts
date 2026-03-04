import type { EvidenceItem } from "./types";

const KEY = "ftos_evidence_registry_v1";

function safeParse<T>(v: string | null): T | null {
  if (!v) return null;
  try { return JSON.parse(v) as T; } catch { return null; }
}

export function loadEvidence(): EvidenceItem[] {
  const v = safeParse<EvidenceItem[]>(localStorage.getItem(KEY));
  if (v?.length) return v;

  const seed: EvidenceItem[] = [
    {
      id: "ev_playbook_base",
      title: "Work Wellbeing Playbook (base interna)",
      url: "TBD (internal): Doc.Base - Work-Wellbeing-Playbook (PDF local)",
      status: "PENDING",
      notes: "Verificar e registrar a referência oficial/URL pública, se aplicável.",
    },
    {
      id: "ev_copsoq_br_validation",
      title: "COPSOQ III — validação BR (base interna)",
      url: "TBD (internal): dissertação Camila Bounassar (PDF local)",
      status: "PENDING",
      notes: "Não reproduzir itens no client. Usar apenas metadados/estrutura.",
    },
  ];
  localStorage.setItem(KEY, JSON.stringify(seed));
  return seed;
}

export function saveEvidence(items: EvidenceItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function verifyEvidence(id: string, owner?: string) {
  const items = loadEvidence();
  const now = new Date().toISOString();
  const next = items.map((e) =>
    e.id === id ? { ...e, status: "VERIFIED" as const, owner: owner ?? e.owner, verifiedAtIso: now } : e
  );
  saveEvidence(next);
  return next;
}

export type EvidenceStatus = "PENDING" | "VERIFIED";

export interface EvidenceItem {
  id: string;
  title: string;
  url: string;
  status: EvidenceStatus;
  owner?: string;
  verifiedAtIso?: string;
  notes?: string;
}

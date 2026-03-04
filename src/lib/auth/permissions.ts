import type { Role } from "./types";

export type Permission =
  | "VIEW_MENSURAR"
  | "VIEW_EDUCAR"
  | "VIEW_TRANSFORMAR"
  | "VIEW_EVOLUIR"
  | "VIEW_COPSOQ_Q1"
  | "MANAGE_USERS"
  | "MANAGE_INTEGRATIONS"
  | "EXPORT_REPORTS"
  | "VERIFY_EVIDENCE";

const ROLE_PERMS: Record<Role, Permission[]> = {
  ADMIN: [
    "VIEW_MENSURAR", "VIEW_EDUCAR", "VIEW_TRANSFORMAR", "VIEW_EVOLUIR",
    "VIEW_COPSOQ_Q1", "MANAGE_USERS", "MANAGE_INTEGRATIONS", "EXPORT_REPORTS", "VERIFY_EVIDENCE",
  ],
  GESTOR_COMPLIANCE: [
    "VIEW_MENSURAR", "VIEW_EDUCAR", "VIEW_TRANSFORMAR", "VIEW_EVOLUIR",
    "VIEW_COPSOQ_Q1", "EXPORT_REPORTS", "VERIFY_EVIDENCE",
  ],
  GESTOR_BEM_ESTAR: [
    "VIEW_MENSURAR", "VIEW_EDUCAR", "VIEW_TRANSFORMAR", "VIEW_EVOLUIR",
    "VIEW_COPSOQ_Q1", "EXPORT_REPORTS",
  ],
  COORDENADOR_GERENTE: ["VIEW_MENSURAR", "VIEW_EDUCAR", "VIEW_TRANSFORMAR", "VIEW_EVOLUIR", "VIEW_COPSOQ_Q1"],
  COLABORADOR: ["VIEW_EDUCAR"],
};

export function can(role: Role | undefined, perm: Permission): boolean {
  if (!role) return false;
  return ROLE_PERMS[role]?.includes(perm) ?? false;
}

export function listPerms(role: Role | undefined): Permission[] {
  if (!role) return [];
  return ROLE_PERMS[role] ?? [];
}

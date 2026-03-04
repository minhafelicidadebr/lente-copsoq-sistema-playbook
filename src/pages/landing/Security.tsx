import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Lock, FileText, Users } from "lucide-react";

export default function LandingSecurity() {
  const items = [
    { icon: Lock, title: "LGPD-by-design", desc: "Separação lógica de dados e controles de acesso (RBAC) por perfil. (Implementação incremental: demo → backend)." },
    { icon: Users, title: "Sem exposição individual", desc: "Resultados agregados, com minCellSize (k-anon) e supressão de células pequenas. Sem ranking individual." },
    { icon: FileText, title: "Auditabilidade", desc: "Trilha de auditoria e pacote de evidências. O sistema entrega governança; não promete conformidade automática." },
    { icon: ShieldCheck, title: "Confiabilidade", desc: "Gates de verificação para evidências/links e política de 'TBD (needs_data)' quando faltarem dados." },
  ];
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="text-2xl font-semibold">Privacidade & Segurança</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Este ambiente está preparado para evoluir de protótipo (Lovable) para SaaS (AI Studio) com governança e controles.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {items.map((x) => (
          <Card key={x.title} className="border-muted/60">
            <CardContent className="p-6">
              <x.icon className="h-5 w-5 text-muted-foreground" />
              <div className="mt-3 text-sm font-semibold">{x.title}</div>
              <div className="mt-1 text-sm text-muted-foreground">{x.desc}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

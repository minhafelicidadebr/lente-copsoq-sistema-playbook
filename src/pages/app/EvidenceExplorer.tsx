import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { loadEvidence, saveEvidence, verifyEvidence } from "@/lib/evidence/registry";
import type { EvidenceItem } from "@/lib/evidence/types";
import { useAuth } from "@/lib/auth/context";

export default function EvidenceExplorer() {
  const { user } = useAuth();
  const [items, setItems] = React.useState<EvidenceItem[]>(() => loadEvidence());

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xl font-semibold">Evidence Explorer</div>
        <div className="mt-1 text-sm text-muted-foreground">
          Catálogo de evidências com gate PENDING/VERIFIED. Não publicar como recomendação ativa enquanto PENDING.
        </div>
      </div>

      <div className="grid gap-4">
        {items.map((e) => (
          <Card key={e.id} className="border-muted/60">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="text-sm font-semibold">{e.title}</div>
                  <div className="mt-1 text-sm text-muted-foreground break-words">{e.url}</div>

                  <div className="mt-3 grid gap-2 md:grid-cols-2">
                    <Input
                      placeholder="Notas internas"
                      value={e.notes ?? ""}
                      onChange={(ev) => {
                        const next = items.map((x) => (x.id === e.id ? { ...x, notes: ev.target.value } : x));
                        setItems(next);
                        saveEvidence(next);
                      }}
                    />
                    <Input
                      placeholder="Owner (responsável)"
                      value={e.owner ?? ""}
                      onChange={(ev) => {
                        const next = items.map((x) => (x.id === e.id ? { ...x, owner: ev.target.value } : x));
                        setItems(next);
                        saveEvidence(next);
                      }}
                    />
                  </div>

                  {e.verifiedAtIso ? (
                    <div className="mt-2 text-xs text-muted-foreground">Verificado em: {e.verifiedAtIso}</div>
                  ) : null}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <Badge variant={e.status === "VERIFIED" ? "default" : "secondary"}>{e.status}</Badge>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const next = verifyEvidence(e.id, user?.name);
                      setItems(next);
                    }}
                    disabled={e.status === "VERIFIED"}
                  >
                    Verificar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

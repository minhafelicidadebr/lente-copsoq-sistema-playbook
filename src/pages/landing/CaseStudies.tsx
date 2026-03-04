import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LandingCaseStudies() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="text-2xl font-semibold">Casos</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Área reservada para estudos de caso auditáveis. Por padrão, este ambiente não publica números sem fonte verificável.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {["Caso A", "Caso B", "Caso C"].map((t) => (
          <Card key={t} className="border-muted/60">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="text-sm font-semibold">{t}</div>
                <Badge variant="secondary">TBD</Badge>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                Placeholder. Inserir somente quando houver evidências e autorização de divulgação.
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

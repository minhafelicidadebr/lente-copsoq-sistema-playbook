import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Printer, X } from "lucide-react";

interface ReportPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportId: string;
  reportTitle: string;
  reportSubtitle: string;
  html: string;
  onPrint: () => void;
  onDownloadHtml: () => void;
  statusBadges?: string[];
}

export default function ReportPreviewDialog({
  open,
  onOpenChange,
  reportId,
  reportTitle,
  reportSubtitle,
  html,
  onPrint,
  onDownloadHtml,
  statusBadges = [],
}: ReportPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 pb-3 border-b border-border flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <DialogTitle className="text-lg font-bold text-foreground">
                {reportTitle}
              </DialogTitle>
              <p className="text-xs text-muted-foreground">{reportSubtitle}</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {statusBadges.map((b) => (
                  <Badge key={b} variant="secondary" className="text-[10px]">
                    {b}
                  </Badge>
                ))}
                <Badge variant="outline" className="text-[10px] font-mono">
                  {reportId.slice(0, 8)}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button size="sm" variant="outline" className="gap-2" onClick={onDownloadHtml}>
                <Download className="h-4 w-4" /> HTML
              </Button>
              <Button size="sm" className="gap-2" onClick={onPrint}>
                <Printer className="h-4 w-4" /> Baixar PDF (Imprimir)
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-auto bg-muted/30 p-4">
          <div
            className="bg-white rounded-lg shadow-card mx-auto"
            style={{ maxWidth: 800, padding: "24px 32px" }}
          >
            <iframe
              title="Prévia do Relatório ESG"
              srcDoc={html}
              className="w-full border-0"
              style={{ minHeight: 700, height: "100%" }}
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

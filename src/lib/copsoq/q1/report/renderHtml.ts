import type { CopsoqEsgReportSpec, MTRFPoint } from "./types";

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string)
  );
}

function zoneBadge(zone: MTRFPoint["zone"]): string {
  if (zone === "PATHOS") return `<span class="badge pathos">PATHOS</span>`;
  if (zone === "PREVENCAO") return `<span class="badge prev">PREVENÇÃO</span>`;
  return `<span class="badge salus">SALUS</span>`;
}

function bandBadge(band: string): string {
  if (band === "ALTO") return `<span class="badge pathos">ALTO</span>`;
  if (band === "MODERADO") return `<span class="badge prev">MODERADO</span>`;
  if (band === "BAIXO") return `<span class="badge salus">BAIXO</span>`;
  return `<span class="badge">TBD</span>`;
}

function mtrfSvg(points: MTRFPoint[]): string {
  const w = 520, h = 280, pad = 26;
  const plotW = w - pad * 2, plotH = h - pad * 2;
  const mapX = (x: number) => pad + (x / 100) * plotW;
  const mapY = (y: number) => pad + (y / 100) * plotH;

  const zoneRect = `
    <rect x="${pad}" y="${mapY(0)}" width="${plotW}" height="${(45 / 100) * plotH}" fill="rgba(22,101,52,.08)"/>
    <rect x="${pad}" y="${mapY(45)}" width="${plotW}" height="${(25 / 100) * plotH}" fill="rgba(180,83,9,.08)"/>
    <rect x="${pad}" y="${mapY(70)}" width="${plotW}" height="${(30 / 100) * plotH}" fill="rgba(185,28,28,.08)"/>`;

  const lines = `
    <line x1="${pad}" y1="${mapY(45)}" x2="${pad + plotW}" y2="${mapY(45)}" stroke="rgba(180,83,9,.5)" stroke-dasharray="4 4"/>
    <line x1="${pad}" y1="${mapY(70)}" x2="${pad + plotW}" y2="${mapY(70)}" stroke="rgba(185,28,28,.5)" stroke-dasharray="4 4"/>`;

  const pts = points.map((p) => {
    const cx = mapX(p.florescimentoX);
    const cy = mapY(p.riscoY);
    const color = p.zone === "PATHOS" ? "rgba(185,28,28,.85)" : p.zone === "PREVENCAO" ? "rgba(180,83,9,.85)" : "rgba(22,101,52,.85)";
    return `<g><circle cx="${cx}" cy="${cy}" r="6" fill="${color}" stroke="white" stroke-width="2"/><text x="${cx + 8}" y="${cy + 4}" font-size="10" fill="#334155">${esc(p.segment)}</text></g>`;
  }).join("\n");

  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="Mapa MTR-F por segmento">
    ${zoneRect}${lines}
    <rect x="${pad}" y="${pad}" width="${plotW}" height="${plotH}" fill="none" stroke="#cbd5e1" stroke-width="1"/>
    ${pts}
    <text x="${pad}" y="${pad - 6}" font-size="10" fill="#64748b">↑ Risco</text>
    <text x="${pad + plotW}" y="${pad + plotH + 16}" font-size="10" fill="#64748b" text-anchor="end">Florescimento →</text>
  </svg>`;
}

function annexList(items: { title: string; status: string }[]): string {
  return items.map((e) => `<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #f1f5f9"><span>${esc(e.title)}</span><span class="badge">${esc(e.status)}</span></div>`).join("\n");
}

export function renderReportHtml(spec: CopsoqEsgReportSpec): string {
  const { branding, compliance, executiveSummary: exec, kpis: k } = spec;
  const date = new Date(spec.generatedAtIso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

  const iliRows = exec.iliTop10.map((r) =>
    `<tr><td>${r.rank}</td><td>${esc(r.intervention)}</td><td>${esc(r.ili)}</td><td>${esc(r.status)}</td><td>${esc(r.owner)}</td></tr>`
  ).join("\n");

  const dimBars = spec.visuals.riskDimensionBars.map((d) =>
    `<div style="display:flex;align-items:center;gap:8px;margin:4px 0">
      <span style="width:180px;font-size:12px">${esc(d.name)}</span>
      <div style="flex:1;background:#f1f5f9;border-radius:6px;height:16px;position:relative">
        <div style="width:${d.score}%;background:${d.band === "ALTO" ? "#dc2626" : d.band === "MODERADO" ? "#d97706" : "#16a34a"};height:100%;border-radius:6px"></div>
      </div>
      <span style="font-size:11px;width:40px;text-align:right">${d.score}</span>
      ${bandBadge(d.band)}
    </div>`
  ).join("\n");

  const css = `
    @page { size: A4; margin: 14mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; font-size: 12px; color: #1e293b; line-height: 1.5; }
    h1 { font-size: 22px; font-weight: 800; margin-bottom: 4px; color: #0f766e; }
    h2 { font-size: 15px; font-weight: 700; margin: 18px 0 8px; color: #1e293b; border-bottom: 2px solid #0f766e; padding-bottom: 4px; }
    h3 { font-size: 13px; font-weight: 600; margin: 12px 0 4px; }
    p { margin: 4px 0; }
    table { width: 100%; border-collapse: collapse; margin: 8px 0; font-size: 11px; }
    th, td { padding: 6px 8px; border: 1px solid #e2e8f0; text-align: left; }
    th { background: #f8fafc; font-weight: 600; }
    .section { margin: 16px 0; page-break-inside: avoid; }
    .kpi-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
    .kpi-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; }
    .kpi-card .label { font-size: 10px; color: #64748b; }
    .kpi-card .value { font-size: 18px; font-weight: 700; }
    .kpi-card .prov { font-size: 9px; color: #94a3b8; }
    .divider { border: none; height: 1px; background: #e2e8f0; margin: 12px 0; }
    .badge { display: inline-block; padding: 3px 8px; border-radius: 999px; font-size: 10px; font-weight: 700; border: 1px solid #e2e8f0; }
    .badge.pathos { color: #b91c1c; border-color: rgba(185,28,28,.25); background: rgba(185,28,28,.06); }
    .badge.prev { color: #b45309; border-color: rgba(180,83,9,.25); background: rgba(180,83,9,.06); }
    .badge.salus { color: #166534; border-color: rgba(22,101,52,.25); background: rgba(22,101,52,.06); }
    .callout { border-left: 4px solid #0ea5e9; background: rgba(14,165,233,.06); padding: 10px 12px; border-radius: 12px; }
    .callout strong { font-weight: 900; }
    .footer { position: fixed; bottom: 10mm; left: 14mm; right: 14mm; font-size: 9px; color: #64748b; white-space: pre-line; display: flex; justify-content: space-between; gap: 10px; }
    .footer .left { white-space: pre-line; }
    .footer .right { text-align: right; }
    .pagebreak { page-break-before: always; }
  `;

  const footerHtml = `<div class="footer">
    <div class="left">${esc(branding.footerText)}</div>
    <div class="right">Relatório ESG ${esc(spec.quarterLabel)} · ${esc(spec.tenant.tenantName)}\nGerado em ${date}\nAudit-ready · com trilha de auditoria</div>
  </div>`;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(branding.title)}</title><style>${css}</style></head>
<body>
${footerHtml}

<div style="text-align:center;margin-bottom:16px">
  <div style="font-size:10px;color:#64748b;margin-bottom:8px">Instituto Felicidade para Todos</div>
  <h1>${esc(branding.title)}</h1>
  <p style="color:#64748b;font-size:12px">${esc(branding.subtitle)}</p>
  <p style="font-size:11px;margin-top:8px">Organização: <strong>${esc(spec.tenant.tenantName)}</strong> · Período: <strong>${esc(spec.quarterLabel)}</strong></p>
  <p style="font-size:10px;color:#94a3b8">Privacidade: agregado, minCellSize ≥ ${spec.tenant.minCellSize}, sem ranking</p>
</div>

<div class="callout" style="margin-bottom:16px">
  <strong>R4 (Compliance):</strong> ${esc(compliance.r4Statement)}
</div>
<div class="callout" style="border-color:#d97706;background:rgba(217,119,6,.06);margin-bottom:16px">
  ${esc(compliance.nonPromiseStatement)}
</div>

<h2>Seção 1 — Sumário Executivo</h2>
<p>Visão geral das zonas MTR-F, top riscos, top alavancas e portfólio inicial (ILI).</p>
<div class="kpi-grid" style="margin:12px 0">
  <div class="kpi-card"><div class="label">${zoneBadge("PATHOS")} PATHOS (alto risco)</div><div class="value">${esc(exec.mtrfZonesOverview.pathosPct.value)}${exec.mtrfZonesOverview.pathosPct.unit ?? ""}</div><div class="prov">Provenance: ${esc(exec.mtrfZonesOverview.pathosPct.provenance?.source ?? "TBD")}</div></div>
  <div class="kpi-card"><div class="label">${zoneBadge("PREVENCAO")} PREVENÇÃO (moderado)</div><div class="value">${esc(exec.mtrfZonesOverview.prevencaoPct.value)}${exec.mtrfZonesOverview.prevencaoPct.unit ?? ""}</div><div class="prov">Provenance: ${esc(exec.mtrfZonesOverview.prevencaoPct.provenance?.source ?? "TBD")}</div></div>
  <div class="kpi-card"><div class="label">${zoneBadge("SALUS")} SALUS (baixo risco)</div><div class="value">${esc(exec.mtrfZonesOverview.salusPct.value)}${exec.mtrfZonesOverview.salusPct.unit ?? ""}</div><div class="prov">Provenance: ${esc(exec.mtrfZonesOverview.salusPct.provenance?.source ?? "TBD")}</div></div>
</div>

<h3>Top 3 riscos identificados</h3>
${exec.top3Risks.map((r) => `<p>${bandBadge(r.band)} ${esc(r.label)}</p>`).join("\n")}
<p style="font-size:10px;color:#94a3b8">Nota: top riscos baseados em dados agregados (ou placeholders). Sem exposição individual.</p>

<h3>Top 3 alavancas de florescimento</h3>
${exec.top3Levers.map((l) => `<p>✦ ${esc(l.label)} <span style="color:#94a3b8">(inferência operacional)</span></p>`).join("\n")}
<p style="font-size:10px;color:#94a3b8">Inferências rotuladas (R1): devem ser validadas por execução e recheck.</p>

<h3>MTR-F — mapa por segmento (agregado)</h3>
<p style="font-size:10px;color:#64748b">Eixo X: capacidade de florescimento · Eixo Y: gravidade psicossocial (COPSOQ). Segmentos com n &lt; minCellSize devem ser bloqueados/agrupados.</p>
${mtrfSvg(spec.visuals.mtrfPoints)}
<p style="font-size:10px">${zoneBadge("PATHOS")} ${zoneBadge("PREVENCAO")} ${zoneBadge("SALUS")}</p>

<div class="pagebreak"></div>

<h3>ILI — Top 10 intervenções priorizadas</h3>
<p style="font-size:10px;color:#94a3b8">ILI será calculado com dados reais (S×U×E×N×A)/(C×T×F). No demo, valores podem estar como TBD (R2).</p>
<table><thead><tr><th>#</th><th>Intervenção</th><th>ILI</th><th>Status</th><th>Responsável</th></tr></thead><tbody>${iliRows}</tbody></table>

<h2>Seção 2 — NR-1 / GRO / PGR — Riscos Psicossociais</h2>
<p>Estrutura de prontidão: perigos → avaliação → plano → acompanhamento → participação → registro.</p>
${["hazards|Identificação de perigos", "riskAssessment|Avaliação e classificação de risco", "actionPlan|Plano de ação", "review|Acompanhamento e revisão", "participation|Participação/consulta de trabalhadores", "registry|Registro (inventário/plano)"].map((s) => {
    const [key, title] = s.split("|");
    const items = (spec.nr1GroPgr as any)[key] as { item: string; status: string }[];
    return `<h3>${title}</h3>\n${items.map((i) => `<p>• ${esc(i.item)} — <strong>${esc(i.status)}</strong></p>`).join("\n")}`;
  }).join("\n")}
<p style="font-size:10px;color:#94a3b8">Nota de método: esta seção organiza o que precisa existir como governança e evidência. Onde estiver TBD, o sistema exige captura/registro para fechar o ciclo no QBR.</p>

<div class="pagebreak"></div>

<h2>Seção 3 — NR-28 — Prontidão Documental</h2>
<p>Catálogo de evidências com timestamps, rastreabilidade, responsáveis e status.</p>
<table><thead><tr><th>Evidência</th><th>Status</th><th>Responsável</th><th>Timestamp</th></tr></thead><tbody>
${spec.nr28Readiness.evidenceCatalog.map((e) => `<tr><td>${esc(e.title)}</td><td>${esc(e.status)}</td><td>${esc(e.owner ?? "TBD")}</td><td>${e.timestampIso ?? "TBD"}</td></tr>`).join("\n")}
</tbody></table>
<p style="font-size:10px;color:#94a3b8">Recomendações: anexar evidências reais (prints, atas, exports) em storage com RBAC e registrar no audit log.</p>

<h2>Seção 4 — Decreto DF 47.412/2025 (quando aplicável)</h2>
<p>Aplicabilidade: <strong>${esc(spec.decreeDf47412.applicable)}</strong> (TBD quando não informado).</p>
${spec.decreeDf47412.items.map((i) => `<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #f1f5f9"><span>${esc(i.item)}</span><span class="badge">${esc(i.status)}</span></div><p style="font-size:9px;color:#94a3b8">TBD (needs_data): registrar ações e evidências se aplicável.</p>`).join("\n")}

<div class="pagebreak"></div>

<h2>Seção 5 — KPIs do Trimestre</h2>
<p>Indicadores de processo e resultado (agregados). Onde não houver dado, o sistema marca TBD.</p>
<div class="kpi-grid">
  <div class="kpi-card"><div class="label">Taxa de resposta COPSOQ</div><div class="value">${esc(k.responseRate.value)}${esc(k.responseRate.unit ?? "")}</div><div class="prov">${esc(k.responseRate.provenance?.source ?? "TBD")}</div></div>
  <div class="kpi-card"><div class="label">Índice de risco global (agregado)</div><div class="value">${esc(k.globalRiskIndex.value)}</div><div class="prov">${esc(k.globalRiskIndex.provenance?.source ?? "TBD")}</div></div>
  <div class="kpi-card"><div class="label">Cobertura Educar (conclusões)</div><div class="value">${esc(k.educarCoverage.value)}${esc(k.educarCoverage.unit ?? "")}</div><div class="prov">${esc(k.educarCoverage.provenance?.source ?? "TBD")}</div></div>
</div>
<div class="kpi-grid" style="margin-top:8px">
  <div class="kpi-card"><div class="label">Bandas (alto)</div><div class="value">${esc(k.riskBands.altoPct.value)}${esc(k.riskBands.altoPct.unit ?? "")}</div></div>
  <div class="kpi-card"><div class="label">Bandas (moderado)</div><div class="value">${esc(k.riskBands.moderadoPct.value)}${esc(k.riskBands.moderadoPct.unit ?? "")}</div></div>
  <div class="kpi-card"><div class="label">Bandas (baixo)</div><div class="value">${esc(k.riskBands.baixoPct.value)}${esc(k.riskBands.baixoPct.unit ?? "")}</div></div>
</div>

<h3>Hotspots por dimensão (0–100)</h3>
<p style="font-size:10px;color:#64748b">Leitura pedagógica: altas pontuações nas dimensões negativas indicam maior pressão. Use para orientar ações do ciclo.</p>
${dimBars}
<p style="font-size:9px;color:#94a3b8">Provenance: local:demoData (R2) — substitua por dados reais do motor COPSOQ.</p>

<div class="pagebreak"></div>

<h2>Seção 6 — Plano do Próximo Ciclo</h2>
<p>Re-medição (recheck), roadmap e governança (QBR).</p>

<h3>Evoluir — Re-medição & Governança</h3>
<div class="kpi-grid">
  <div class="kpi-card"><div class="label">Tipo</div><div style="font-size:12px;font-weight:600">${esc(spec.nextCyclePlan.recheck.type)}</div></div>
  <div class="kpi-card"><div class="label">Comparação</div><div style="font-size:12px;font-weight:600">${esc(spec.nextCyclePlan.recheck.comparison)}</div></div>
  <div class="kpi-card"><div class="label">Cadência</div><div style="font-size:12px;font-weight:600">${esc(spec.nextCyclePlan.recheck.cadence)}</div></div>
</div>
<p style="margin-top:8px"><strong>Audit Ready:</strong> ${esc(spec.nextCyclePlan.recheck.auditReady)}</p>
<p style="font-size:11px;margin-top:4px">Verificações do recheck: ${spec.nextCyclePlan.recheckValidations.map(esc).join(" · ")}</p>

<h3>Roadmap do próximo trimestre</h3>
<table><thead><tr><th>Ação</th><th>Dono</th><th>Quando</th><th>Status</th></tr></thead><tbody>
${spec.nextCyclePlan.roadmap.map((r) => `<tr><td>${esc(r.item)}</td><td>${esc(r.owner)}</td><td>${esc(r.when)}</td><td>${esc(r.status)}</td></tr>`).join("\n")}
</tbody></table>
<p style="font-size:10px;color:#94a3b8">Princípio de prova: o ciclo só fecha quando existe (1) execução registrada + (2) evidência anexada + (3) recheck confirmado.</p>

<div class="pagebreak"></div>

<h2>Anexos de Evidência</h2>
<p>Itens abaixo devem ser anexados e vinculados a timestamps, responsáveis e status.</p>
<h3>Catálogo de evidências</h3>
${annexList(spec.annexes.evidenceCatalog.map((e) => ({ title: e.title, status: e.status })))}
<h3>Prints de dashboards agregados</h3>
${annexList(spec.annexes.dashboardSnapshots.map((e) => ({ title: e.title, status: e.status })))}
<h3>Registro de consultas e comunicações</h3>
${annexList(spec.annexes.consultationRecords.map((e) => ({ title: e.title, status: e.status })))}
<h3>Matriz ILI com justificativas</h3>
${annexList(spec.annexes.iliMatrix.map((e) => ({ title: e.title, status: e.status })))}

<p style="margin-top:16px;font-size:10px;color:#94a3b8;text-align:center">Gerado automaticamente — versão inicial. Substitua TBD por dados reais e anexos ao longo do trimestre.</p>

</body></html>`;
}

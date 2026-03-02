import { useCallback, useMemo, useState } from "react";
import ReactFlow, {
  Background, Controls, MiniMap,
  useNodesState, useEdgesState,
  type Node, type Edge,
  MarkerType,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";

import DriverNodeCard from "./DriverNodeCard";
import MechanismPill from "./MechanismPill";
import { EnablesEdge, TradeoffEdge } from "./GraphEdges";
import GraphTooltip from "./GraphTooltip";
import GraphNodePopout from "./GraphNodePopout";
import GraphGuidedTour from "./GraphGuidedTour";
import { DRIVERS, MECHANISMS, GRAPH_EDGES, TIERS, getNodeData, isDriver, type TierKey } from "./graphData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Route, Table2 } from "lucide-react";

// ── Dagre layout ───────────────────────────────────────────
const DRIVER_W = 180;
const DRIVER_H = 80;
const MECH_W = 170;
const MECH_H = 50;

function layoutGraph(rawNodes: Node[], rawEdges: Edge[]): Node[] {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "LR", nodesep: 70, ranksep: 120 });

  rawNodes.forEach((n) => {
    const isDriverNode = n.type === "driverNode";
    g.setNode(n.id, { width: isDriverNode ? DRIVER_W : MECH_W, height: isDriverNode ? DRIVER_H : MECH_H });
  });
  rawEdges.forEach((e) => g.setEdge(e.source, e.target));
  dagre.layout(g);

  return rawNodes.map((n) => {
    const pos = g.node(n.id);
    const isDriverNode = n.type === "driverNode";
    return {
      ...n,
      position: {
        x: pos.x - (isDriverNode ? DRIVER_W : MECH_W) / 2,
        y: pos.y - (isDriverNode ? DRIVER_H : MECH_H) / 2,
      },
    };
  });
}

// ── Build nodes & edges ────────────────────────────────────
function buildInitialNodes(): Node[] {
  const driverNodes: Node[] = Object.entries(DRIVERS).map(([slug, d]) => ({
    id: `drv_${slug}`,
    type: "driverNode",
    position: { x: 0, y: 0 },
    data: { slug, label: d.label, tier: d.tier as TierKey, definition_short: d.definition_short },
  }));
  const mechNodes: Node[] = Object.entries(MECHANISMS).map(([id, m]) => ({
    id,
    type: "mechanismNode",
    position: { x: 0, y: 0 },
    data: { label: m.label, definition_short: m.definition_short },
  }));
  return [...driverNodes, ...mechNodes];
}

function buildInitialEdges(): Edge[] {
  return GRAPH_EDGES.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    type: e.data.relation === "tradeoff" ? "tradeoffEdge" : "enablesEdge",
    data: e.data,
    markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14 },
    animated: e.data.relation === "enables",
  }));
}

const nodeTypes = { driverNode: DriverNodeCard, mechanismNode: MechanismPill };
const edgeTypes = { enablesEdge: EnablesEdge, tradeoffEdge: TradeoffEdge };

// ── Tier Legend ─────────────────────────────────────────────
const TIER_LEGEND = Object.entries(TIERS).filter(([k]) => k !== "bridge").map(([, v]) => v);

const EDGE_LEGEND = [
  { label: "Habilita", color: "hsl(var(--primary))", dash: false },
  { label: "Trade-off", color: "hsl(var(--copsoq-prevencao))", dash: true },
];

// ── View modes ──────────────────────────────────────────────
type ViewMode = "graph" | "table";

// ── Main Component ──────────────────────────────────────────
export default function WWPSystemGraph() {
  const rawNodes = useMemo(buildInitialNodes, []);
  const rawEdges = useMemo(buildInitialEdges, []);
  const laidOut = useMemo(() => layoutGraph(rawNodes, rawEdges), [rawNodes, rawEdges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(laidOut);
  const [edges, , onEdgesChange] = useEdgesState(rawEdges);

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [tooltipNode, setTooltipNode] = useState<{ id: string; x: number; y: number } | null>(null);
  const [popoutNode, setPopoutNode] = useState<string | null>(null);
  const [tourId, setTourId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("graph");

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNode(node.id);
    setPopoutNode(node.id);
    setTooltipNode(null);
  }, []);

  const onNodeMouseEnter = useCallback((_: any, node: Node) => {
    if (!popoutNode) {
      setTooltipNode({ id: node.id, x: (node.position?.x || 0) + 200, y: (node.position?.y || 0) });
    }
  }, [popoutNode]);

  const onNodeMouseLeave = useCallback(() => {
    setTooltipNode(null);
  }, []);

  const tooltipData = tooltipNode ? getNodeData(tooltipNode.id) : null;
  const popoutData = popoutNode ? getNodeData(popoutNode) : null;

  if (viewMode === "table") {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">Tabela de Dependências (Acessível)</h3>
          <Button variant="ghost" size="sm" onClick={() => setViewMode("graph")} className="text-xs gap-1.5">
            <Route className="h-3.5 w-3.5" /> Ver Grafo
          </Button>
        </div>
        <div className="overflow-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Origem</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Relação</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Destino</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Peso</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Racional</th>
              </tr>
            </thead>
            <tbody>
              {GRAPH_EDGES.map((e) => {
                const src = getNodeData(e.source);
                const tgt = getNodeData(e.target);
                return (
                  <tr key={e.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="p-3 text-foreground font-medium">{(src as any)?.label || e.source}</td>
                    <td className="p-3">
                      <Badge variant={e.data.relation === "enables" ? "default" : "secondary"} className="text-[10px]">
                        {e.data.relation}
                      </Badge>
                    </td>
                    <td className="p-3 text-foreground font-medium">{(tgt as any)?.label || e.target}</td>
                    <td className="p-3 text-muted-foreground">{(e.data.weight * 100).toFixed(0)}%</td>
                    <td className="p-3 text-xs text-muted-foreground max-w-[200px]">{e.data.rationale_short}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] rounded-xl border border-border bg-background overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={1.6}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="hsl(var(--border))" gap={24} size={1} />
        <Controls className="!bg-card !border-border !shadow-card [&>button]:!bg-card [&>button]:!border-border [&>button]:!text-foreground" />
        <MiniMap
          nodeColor={(n) => {
            const tier = n.data?.tier as TierKey;
            return TIERS[tier]?.color || "hsl(var(--muted))";
          }}
          className="!bg-card !border-border"
          maskColor="hsl(var(--background) / 0.7)"
        />

        {/* Top panel: tour buttons + view toggle */}
        <Panel position="top-left" className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTourId("how_to_read")}
            className="text-xs gap-1.5 bg-card/90 backdrop-blur-sm"
          >
            <BookOpen className="h-3.5 w-3.5" /> Como ler
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTourId("playbook_sequence")}
            className="text-xs gap-1.5 bg-card/90 backdrop-blur-sm"
          >
            <Route className="h-3.5 w-3.5" /> Sequência
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode("table")}
            className="text-xs gap-1.5"
          >
            <Table2 className="h-3.5 w-3.5" /> Tabela
          </Button>
        </Panel>

        {/* Bottom legend */}
        <Panel position="bottom-left" className="flex flex-wrap items-center gap-3 bg-card/90 backdrop-blur-sm rounded-lg border border-border px-3 py-2">
          {TIER_LEGEND.map((t) => (
            <div key={t.label} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: t.color }} />
              <span className="text-[10px] font-medium text-foreground">{t.label}</span>
            </div>
          ))}
          <span className="text-muted-foreground text-[10px]">|</span>
          {EDGE_LEGEND.map((e) => (
            <div key={e.label} className="flex items-center gap-1.5">
              <svg width="20" height="8"><line x1="0" y1="4" x2="20" y2="4" stroke={e.color} strokeWidth="2" strokeDasharray={e.dash ? "4 3" : "0"} /></svg>
              <span className="text-[10px] font-medium text-foreground">{e.label}</span>
            </div>
          ))}
        </Panel>
      </ReactFlow>

      {/* Tooltip overlay */}
      {tooltipNode && tooltipData && (
        <div style={{ position: "absolute", left: Math.min(tooltipNode.x, 500), top: Math.max(tooltipNode.y, 10) }}>
          <GraphTooltip
            nodeId={tooltipNode.id}
            data={tooltipData}
            position={{ x: tooltipNode.x, y: tooltipNode.y }}
            onClose={() => setTooltipNode(null)}
            onOpenPopout={() => {
              setPopoutNode(tooltipNode.id);
              setTooltipNode(null);
            }}
          />
        </div>
      )}

      {/* Node Popout Dialog */}
      {popoutNode && popoutData && (
        <GraphNodePopout
          open={!!popoutNode}
          onClose={() => { setPopoutNode(null); setSelectedNode(null); }}
          nodeId={popoutNode}
          data={popoutData}
        />
      )}

      {/* Guided Tour */}
      {tourId && (
        <GraphGuidedTour tourId={tourId} onClose={() => setTourId(null)} />
      )}
    </div>
  );
}

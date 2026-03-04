type TelemetryEvent = {
  name: string;
  ts: number;
  tenantId?: string;
  userId?: string;
  props?: Record<string, unknown>;
};

const KEY = "ftos_telemetry_events_v1";

export function track(name: string, props?: Record<string, unknown>) {
  const evt: TelemetryEvent = { name, ts: Date.now(), props };
  try {
    const prev = JSON.parse(localStorage.getItem(KEY) ?? "[]") as TelemetryEvent[];
    prev.push(evt);
    localStorage.setItem(KEY, JSON.stringify(prev.slice(-5000)));
  } catch {
    // ignore
  }
  console.debug("[telemetry]", evt);
}

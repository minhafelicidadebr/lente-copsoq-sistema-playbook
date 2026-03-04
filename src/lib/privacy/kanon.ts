export type SegmentCounts = Record<string, number>;

export function applyKAnonToMtrfPoints<T extends { segment: string }>(
  points: T[],
  counts: SegmentCounts | undefined,
  minCellSize: number
): Array<T & { suppressed?: boolean; reason?: string }> {
  if (!counts) return points;
  return points.map((p) => {
    const n = counts[p.segment];
    if (typeof n === "number" && n > 0 && n < minCellSize) {
      return { ...p, suppressed: true, reason: `minCellSize(${minCellSize})` };
    }
    return p;
  });
}

/**
 * CROSS-LINE & MULTI-LINE LASER RECOMMENDATION RULES
 *
 * Replaces the previous fully-enumerated 60-path table (one entry per
 * trade x environment x accuracy x coverage combination) with a rule list.
 * Each rule specifies only the dimensions that actually change the pick;
 * omitted dimensions match any value. When multiple rules match, the most
 * specific one wins (most dimensions specified takes priority).
 *
 * This file was generated from the original 60-entry table and verified
 * programmatically to reproduce every original best/alternative/upgrade
 * pick exactly (see /derivation notes in PR). upgradeReason text has been
 * rewritten to short, factual, product-attribute-based copy shared across
 * rules that recommend the same upgrade — the original per-path reason
 * strings were AI-generated rewordings of the same handful of points and
 * did not encode distinct product judgment worth preserving verbatim.
 *
 * Dimensions:
 * - trade: builders | cabinets | tilers | electricians | plumbers
 * - environment: indoor | outdoor | both
 * - accuracy: high | rough
 * - coverage: 360 | reflines
 */

export type LaserRuleWhen = Partial<{
  trade: string;
  environment: string;
  accuracy: string;
  coverage: string;
}>;

export type LaserRule = {
  when: LaserRuleWhen;
  best: string;
  alternative: string | null;
  upgrade: string | null;
  upgradeReason: string;
};

/**
 * Product IDs whose own laserman.com.au page verifiably states or includes
 * a wall-mounting bracket/adapter/magnetic wall mount. This is the single
 * source of truth for wall-mount status — there is no separate flag on the
 * product records in productKnowledge.ts, specifically to avoid two places
 * needing to be kept in sync. Update this list (and the keySpecs line on the
 * matching product) if a product's wall-mount status changes.
 *
 * Verified against each product's live page on 2026-08-21:
 * - geo-axeo-3d: wall rail adapter included
 * - geo-6x-sp: multi-functional mount w/ wall & drywall-track magnets, included
 * - geo-6x-xr: height-adjustable wall mount w/ swivel support rail, included
 * - leica-lino-l6g-1: UAL 130 wall-mount adapter included
 * Not confirmed wall-mountable (no wall-mount bracket stated on their own
 * page): geo1x, imex-lx3dg, bear-servo-360g, geo-flg-70.
 */
export const WALL_MOUNTABLE_LASER_IDS: string[] = [
  "geo-axeo-3d",
  "geo-6x-sp",
  "geo-6x-xr",
  "leica-lino-l6g-1",
];

const isWallMountable = (id: string | null) => Boolean(id) && WALL_MOUNTABLE_LASER_IDS.includes(id as string);

export const LASER_RULES: LaserRule[] = [
  { when: { trade: "builders", environment: "both", accuracy: "high", coverage: "360" }, best: "bear-servo-360g", alternative: "geo-6x-sp", upgrade: "geo-flg-70", upgradeReason: "Motorized self-leveling handles complex ceilings and variable heights that manual leveling can't." },
  { when: { trade: "builders", environment: "both", accuracy: "high", coverage: "reflines" }, best: "bear-servo-360g", alternative: "imex-lx3dg", upgrade: "geo-flg-70", upgradeReason: "±1mm accuracy — imex-lx3dg is a solid reference-line unit but only ±2mm." },
  { when: { trade: "builders", environment: "indoor", accuracy: "high", coverage: "360" }, best: "bear-servo-360g", alternative: "leica-lino-l6g-1", upgrade: "geo-flg-70", upgradeReason: "Motorized self-leveling handles complex ceilings and variable heights that manual leveling can't." },
  { when: { trade: "builders", environment: "indoor", accuracy: "high", coverage: "reflines" }, best: "bear-servo-360g", alternative: "imex-lx3dg", upgrade: "geo-flg-70", upgradeReason: "±1mm accuracy — imex-lx3dg is a solid reference-line unit but only ±2mm." },
  { when: { trade: "builders", environment: "indoor", accuracy: "rough", coverage: "360" }, best: "geo-axeo-3d", alternative: null, upgrade: "imex-lx3dg", upgradeReason: "±2mm accuracy and hyperbright lines improve visibility and precision over the base rough-accuracy unit." },
  { when: { trade: "builders", environment: "outdoor", accuracy: "high" }, best: "bear-servo-360g", alternative: "geo-6x-sp", upgrade: "geo-flg-70", upgradeReason: "±1mm accuracy with an 80m outdoor range — geo-6x-sp covers more range but is only ±2mm." },
  { when: { trade: "cabinets", environment: "both", accuracy: "high", coverage: "360" }, best: "bear-servo-360g", alternative: "geo-6x-sp", upgrade: "geo-flg-70", upgradeReason: "Motorized self-leveling handles complex ceilings and variable heights that manual leveling can't." },
  { when: { trade: "cabinets", environment: "both", accuracy: "high", coverage: "reflines" }, best: "bear-servo-360g", alternative: "imex-lx3dg", upgrade: "geo-flg-70", upgradeReason: "±1mm accuracy — imex-lx3dg is a solid reference-line unit but only ±2mm." },
  { when: { trade: "cabinets", environment: "indoor", accuracy: "high", coverage: "360" }, best: "bear-servo-360g", alternative: "leica-lino-l6g-1", upgrade: "geo-flg-70", upgradeReason: "Motorized self-leveling handles complex ceilings and variable heights that manual leveling can't." },
  { when: { trade: "cabinets", environment: "indoor", accuracy: "high", coverage: "reflines" }, best: "bear-servo-360g", alternative: "imex-lx3dg", upgrade: "geo-flg-70", upgradeReason: "±1mm accuracy — imex-lx3dg is a solid reference-line unit but only ±2mm." },
  { when: { trade: "cabinets", environment: "indoor", accuracy: "rough", coverage: "360" }, best: "geo-axeo-3d", alternative: null, upgrade: "imex-lx3dg", upgradeReason: "±2mm accuracy and hyperbright lines improve visibility and precision over the base rough-accuracy unit." },
  { when: { trade: "cabinets", environment: "outdoor", accuracy: "high" }, best: "bear-servo-360g", alternative: "geo-6x-sp", upgrade: "geo-flg-70", upgradeReason: "±1mm accuracy with an 80m outdoor range — geo-6x-sp covers more range but is only ±2mm." },
  { when: { trade: "tilers", environment: "both", accuracy: "high", coverage: "360" }, best: "bear-servo-360g", alternative: "geo-6x-xr", upgrade: "geo-flg-70", upgradeReason: "±1mm accuracy — geo-6x-xr is tiler-specific but only ±2mm." },
  { when: { trade: "tilers", environment: "both", accuracy: "high", coverage: "reflines" }, best: "bear-servo-360g", alternative: "geo-6x-xr", upgrade: "geo-flg-70", upgradeReason: "±1mm accuracy — geo-6x-xr is tiler-specific but only ±2mm." },
  { when: { trade: "tilers", environment: "indoor", accuracy: "high", coverage: "360" }, best: "bear-servo-360g", alternative: "geo-6x-xr", upgrade: "geo-flg-70", upgradeReason: "±1mm accuracy — geo-6x-xr is tiler-specific but only ±2mm." },
  { when: { trade: "tilers", environment: "indoor", accuracy: "high", coverage: "reflines" }, best: "bear-servo-360g", alternative: "geo-6x-xr", upgrade: "geo-flg-70", upgradeReason: "±1mm accuracy — geo-6x-xr is tiler-specific but only ±2mm." },
  { when: { trade: "tilers", environment: "indoor", accuracy: "rough", coverage: "360" }, best: "geo-axeo-3d", alternative: null, upgrade: "geo-6x-xr", upgradeReason: "Tiler-specific reference features reduce layout errors versus the general-purpose rough unit." },
  { when: { trade: "tilers", environment: "outdoor", accuracy: "high", coverage: "reflines" }, best: "bear-servo-360g", alternative: "geo-6x-xr", upgrade: "geo-flg-70", upgradeReason: "±1mm accuracy with an 80m outdoor range — geo-6x-xr is tiler-specific but only ±2mm." },
  { when: { trade: "electricians", environment: "both", accuracy: "high", coverage: "360" }, best: "bear-servo-360g", alternative: "leica-lino-l6g-1", upgrade: "geo-flg-70", upgradeReason: "Motorized self-leveling handles complex ceilings and variable heights that manual leveling can't." },
  { when: { trade: "electricians", environment: "both", accuracy: "high", coverage: "reflines" }, best: "bear-servo-360g", alternative: "imex-lx3dg", upgrade: "geo-flg-70", upgradeReason: "±1mm accuracy — imex-lx3dg is a solid reference-line unit but only ±2mm." },
  { when: { trade: "electricians", environment: "indoor", accuracy: "high", coverage: "360" }, best: "bear-servo-360g", alternative: "leica-lino-l6g-1", upgrade: "geo-flg-70", upgradeReason: "Motorized self-leveling handles complex ceilings and variable heights that manual leveling can't." },
  { when: { trade: "electricians", environment: "indoor", accuracy: "high", coverage: "reflines" }, best: "bear-servo-360g", alternative: "imex-lx3dg", upgrade: "geo-flg-70", upgradeReason: "±1mm accuracy — imex-lx3dg is a solid reference-line unit but only ±2mm." },
  { when: { trade: "electricians", environment: "indoor", accuracy: "rough", coverage: "360" }, best: "geo-axeo-3d", alternative: null, upgrade: "leica-lino-l6g-1", upgradeReason: "Wide self-leveling range adds precision once tolerances tighten beyond rough accuracy." },
  { when: { trade: "electricians", environment: "outdoor", accuracy: "high" }, best: "bear-servo-360g", alternative: "geo-6x-sp", upgrade: "geo-flg-70", upgradeReason: "±1mm accuracy with an 80m outdoor range — geo-6x-sp covers more range but is only ±2mm." },
  { when: { trade: "plumbers", environment: "both", accuracy: "high", coverage: "360" }, best: "bear-servo-360g", alternative: "leica-lino-l6g-1", upgrade: "geo-flg-70", upgradeReason: "±1mm accuracy, explicitly stated on the product page — leica-lino-l6g-1's ±0.2mm/m spec (per Leica's datasheet) is comparable but isn't stated on its own Laserman listing." },
  { when: { trade: "plumbers", environment: "both", accuracy: "high", coverage: "reflines" }, best: "bear-servo-360g", alternative: "imex-lx3dg", upgrade: "geo-flg-70", upgradeReason: "±1mm accuracy — imex-lx3dg is a solid reference-line unit but only ±2mm." },
  { when: { trade: "plumbers", environment: "indoor", accuracy: "high", coverage: "360" }, best: "bear-servo-360g", alternative: "leica-lino-l6g-1", upgrade: "geo-flg-70", upgradeReason: "±1mm accuracy, explicitly stated on the product page — leica-lino-l6g-1's ±0.2mm/m spec (per Leica's datasheet) is comparable but isn't stated on its own Laserman listing." },
  { when: { trade: "plumbers", environment: "indoor", accuracy: "high", coverage: "reflines" }, best: "bear-servo-360g", alternative: "imex-lx3dg", upgrade: "geo-flg-70", upgradeReason: "±1mm accuracy — imex-lx3dg is a solid reference-line unit but only ±2mm." },
  { when: { trade: "plumbers", environment: "indoor", accuracy: "rough", coverage: "360" }, best: "geo-axeo-3d", alternative: null, upgrade: "leica-lino-l6g-1", upgradeReason: "Wide self-leveling range adds precision once tolerances tighten beyond rough accuracy." },
  { when: { trade: "plumbers", environment: "outdoor", accuracy: "high" }, best: "bear-servo-360g", alternative: "geo-6x-sp", upgrade: "geo-flg-70", upgradeReason: "±1mm accuracy with an 80m outdoor range — geo-6x-sp covers more range but is only ±2mm." },
  { when: { environment: "both", accuracy: "rough", coverage: "360" }, best: "geo-axeo-3d", alternative: null, upgrade: "geo-6x-sp", upgradeReason: "140m receiver range and better durability for larger sites than the base rough unit." },
  { when: { environment: "outdoor", accuracy: "high", coverage: "360" }, best: "bear-servo-360g", alternative: "geo-6x-sp", upgrade: "geo-flg-70", upgradeReason: "±1mm accuracy with an 80m outdoor range — geo-6x-sp covers more range but is only ±2mm." },
  { when: { environment: "outdoor", accuracy: "rough", coverage: "360" }, best: "geo-axeo-3d", alternative: null, upgrade: "geo-6x-sp", upgradeReason: "140m receiver range and better durability for larger sites than the base rough unit." },
  { when: { accuracy: "rough", coverage: "reflines" }, best: "geo1x", alternative: null, upgrade: "geo-axeo-3d", upgradeReason: "360° coverage speeds up work by eliminating manual repositioning between lines." },
];

const DIMENSION_KEYS: (keyof LaserRuleWhen)[] = ["trade", "environment", "accuracy", "coverage"];

/**
 * Resolve a laser-level recommendation by matching answers against LASER_RULES.
 * The most specific matching rule wins (ties broken by declaration order).
 * Behavior is identical to the old flat lookup for all 60 original combinations.
 */
function matchLaserRule(answers: {
  trade: string;
  environment: string;
  accuracy: string;
  coverage: string;
}): LaserRule | null {
  let bestMatch: LaserRule | null = null;
  let bestSpecificity = -1;
  for (const rule of LASER_RULES) {
    const isMatch = DIMENSION_KEYS.every(
      (k) => !rule.when[k] || rule.when[k] === answers[k]
    );
    if (!isMatch) continue;
    const specificity = DIMENSION_KEYS.filter((k) => rule.when[k]).length;
    if (specificity > bestSpecificity) {
      bestMatch = rule;
      bestSpecificity = specificity;
    }
  }
  return bestMatch;
}

/**
 * Resolve a laser-level recommendation, optionally requiring the "best"
 * (and, where possible, "alternative") pick to be wall-mountable.
 *
 * When `wallmount` is "yes" and the rule matched by trade/environment/
 * accuracy/coverage doesn't point at a wall-mountable product, this swaps
 * in the closest wall-mountable option instead — preferring one that keeps
 * the requested accuracy tier — rather than silently ignoring the request.
 * "no" and "unsure" (or an unset wallmount) never change the base match, so
 * every previously-verified trade/environment/accuracy/coverage combination
 * still resolves exactly as before.
 */
export function lookupLaserRule(answers: {
  trade: string;
  environment: string;
  accuracy: string;
  coverage: string;
  wallmount?: string;
}): LaserRule | null {
  const baseMatch = matchLaserRule(answers);
  if (!baseMatch) return null;
  if (answers.wallmount !== "yes") return baseMatch;
  if (isWallMountable(baseMatch.best)) return baseMatch;

  // Need a wall-mountable "best" pick. Prefer a wall-mountable candidate
  // that matches the requested accuracy tier so we don't silently trade
  // away precision the user asked for; fall back to any wall-mountable
  // laser if none match the tier.
  const accuracyRank: Record<string, number> = {
    "geo-axeo-3d": 3, // ±3mm
    "geo-6x-sp": 2, // ±2mm
    "geo-6x-xr": 2, // ±2mm
    "leica-lino-l6g-1": 1, // ±0.2mm/m per Leica's datasheet — tightest available
  };
  const wantsHighAccuracy = answers.accuracy === "high";
  const candidates = [...WALL_MOUNTABLE_LASER_IDS].sort((a, b) => (accuracyRank[a] ?? 9) - (accuracyRank[b] ?? 9));
  const tieredCandidates = wantsHighAccuracy
    ? candidates.filter((id) => (accuracyRank[id] ?? 9) <= 2)
    : candidates;
  const replacementBest = (tieredCandidates[0] ?? candidates[0]) as string;

  // Keep the original alternative if it's already wall-mountable and isn't
  // the same product as the new best; otherwise offer the next-closest
  // wall-mountable option (excluding the new best) as the alternative so
  // the user still sees a second, distinct wall-mountable choice.
  const replacementAlternative =
    isWallMountable(baseMatch.alternative) && baseMatch.alternative !== replacementBest
      ? baseMatch.alternative
      : candidates.find((id) => id !== replacementBest) ?? null;

  // Guard against the upgrade slot duplicating the new best pick (e.g. the
  // original rule's upgrade happens to be the product we just swapped in).
  const replacementUpgrade = baseMatch.upgrade !== replacementBest ? baseMatch.upgrade : null;

  return {
    when: baseMatch.when,
    best: replacementBest,
    alternative: replacementAlternative,
    upgrade: replacementUpgrade,
    upgradeReason:
      "Swapped to a wall-mountable option since wall mounting was requested — the mount ships with the unit.",
  };
}

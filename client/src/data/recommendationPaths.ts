/**
 * HARDCODED RECOMMENDATION PATHS — SIMPLIFIED MEASURE ROUTING
 *
 * Measure branch now simplified:
 * - DISTANCE: measure-type → measure-range (3 questions max)
 * - MOISTURE: measure-type → moisture-substrate (2 questions max)
 * - TEMPERATURE: measure-type only (1 question)
 *
 * Laser-levels branch uses LASER_RULES (see laserPaths.ts) — a rule-based
 * lookup that replaced the old fully-enumerated 60-path table. See
 * laserPaths.ts for details; behavior for all existing combinations is
 * unchanged and was verified against the original table before switching.
 *
 * Updated: 2026-08-20
 */

import type { FinderGoal, Answers } from "./productKnowledge";
import { lookupLaserRule } from "./laserPaths";

export type RecommendationPath = {
  best: string;
  alternative: string | null;
  upgrade: string | null;
};

export type RecommendationMap = {
  [goal in FinderGoal]: Record<string, RecommendationPath>;
};

function buildPathKey(answers: Answers, questionIds: string[]): string {
  return questionIds
    .map((id) => answers[id] || "unknown")
    .join("_")
    .toLowerCase();
}

const FIND_PATHS: Record<string, RecommendationPath> = {
  // ============================================================================
  // CABLES & POWER
  // ============================================================================
  "cables_shallow_no": { best: "cat4", alternative: null, upgrade: "cscope" },
  "cables_shallow_yes": { best: "cscope", alternative: "cat4", upgrade: "rd7200" },
  "cables_shallow_unsure": { best: "cat4", alternative: "cscope", upgrade: null },

  "cables_standard_no": { best: "cat4", alternative: null, upgrade: "cscope" },
  "cables_standard_yes": { best: "cscope", alternative: "cat4", upgrade: "rd7200" },
  "cables_standard_unsure": { best: "cat4", alternative: "cscope", upgrade: null },

  "cables_deep_no": { best: "rd7200", alternative: "cat4", upgrade: null },
  "cables_deep_yes": { best: "rd7200", alternative: "cscope", upgrade: null },
  "cables_deep_unsure": { best: "rd7200", alternative: "cscope", upgrade: null },

  "cables_unsure_no": { best: "cat4", alternative: "cscope", upgrade: "rd7200" },
  "cables_unsure_yes": { best: "cscope", alternative: "cat4", upgrade: "rd7200" },
  "cables_unsure_unsure": { best: "cat4", alternative: "cscope", upgrade: "rd7200" },

  // ============================================================================
  // PIPES & WATER
  // ============================================================================
  "pipes_shallow_no": { best: "cat4", alternative: null, upgrade: "cscope" },
  "pipes_shallow_yes": { best: "cscope", alternative: "cat4", upgrade: "rd7200" },
  "pipes_shallow_unsure": { best: "cat4", alternative: "cscope", upgrade: null },

  "pipes_standard_no": { best: "cat4", alternative: null, upgrade: "cscope" },
  "pipes_standard_yes": { best: "cscope", alternative: "cat4", upgrade: "rd7200" },
  "pipes_standard_unsure": { best: "cat4", alternative: "cscope", upgrade: null },

  "pipes_deep_no": { best: "rd7200", alternative: "cat4", upgrade: null },
  "pipes_deep_yes": { best: "rd7200", alternative: "cscope", upgrade: null },
  "pipes_deep_unsure": { best: "rd7200", alternative: "cscope", upgrade: null },

  "pipes_unsure_no": { best: "cat4", alternative: "cscope", upgrade: "rd7200" },
  "pipes_unsure_yes": { best: "cscope", alternative: "cat4", upgrade: "rd7200" },
  "pipes_unsure_unsure": { best: "cat4", alternative: "cscope", upgrade: "rd7200" },

  // ============================================================================
  // ELECTRICAL FAULTS (direct recommendation — no depth question)
  // ============================================================================
  "electrical": { best: "mt195", alternative: "mt405ex", upgrade: null },
};

const MEASURE_PATHS: Record<string, RecommendationPath> = {
  // ============================================================================
  // DISTANCE (measure-type → measure-range)
  // ============================================================================
  "distance_short": { best: "geotape", alternative: "distox1", upgrade: "distox3" },
  "distance_medium": { best: "distox3", alternative: "distox1", upgrade: "distod5" },
  "distance_long": { best: "distod5", alternative: null, upgrade: "distox6" },
  "distance_unsure": { best: "distox1", alternative: "distox3", upgrade: "distod5" },

  // ============================================================================
  // MOISTURE (measure-type → moisture-substrate)
  // ============================================================================
  // General building materials: portable to digital options
  "moisture_general": { best: "mex5", alternative: "me5", upgrade: null },

  // Concrete-specific: budget to professional options
  "moisture_concrete": { best: "cme5", alternative: "cmex5", upgrade: null },

  // Unsure/flexible: default to general building meter
  "moisture_unsure": { best: "mex5", alternative: "me5", upgrade: "cmex5" },

  // ============================================================================
  // TEMPERATURE (measure-type only)
  // ============================================================================
  "temperature": { best: "b20s", alternative: "mt691", upgrade: null },
};

const POSITION_PATHS: Record<string, RecommendationPath> = {
  // ROTARY LEVELS: rotary-levels_{environment}_{accuracy}_{range}
  "rotary-levels_outdoor_general_short": { best: "geofennel-fl105h", alternative: "topcon", upgrade: "geofennel-fl115h" },
  "rotary-levels_outdoor_general_medium": { best: "geofennel-fl105h", alternative: "topcon", upgrade: "spectra-ll500" },
  "rotary-levels_outdoor_general_long": { best: "geofennel-fl115h", alternative: "spectra-ll500", upgrade: null },
  "rotary-levels_outdoor_general_unsure": { best: "geofennel-fl105h", alternative: "topcon", upgrade: "spectra-ll500" },
  "rotary-levels_outdoor_specified_short": { best: "geofennel-fl115h", alternative: "topcon-h5a", upgrade: null },
  "rotary-levels_outdoor_specified_medium": { best: "geofennel-fl115h", alternative: "topcon-h5a", upgrade: "spectra-ll500" },
  "rotary-levels_outdoor_specified_long": { best: "geofennel-fl115h", alternative: "spectra-ll500", upgrade: null },
  "rotary-levels_outdoor_specified_unsure": { best: "geofennel-fl115h", alternative: "topcon-h5a", upgrade: "spectra-ll500" },
  "rotary-levels_outdoor_survey_short": { best: "geofennel-fl115h", alternative: null, upgrade: null },
  "rotary-levels_outdoor_survey_medium": { best: "geofennel-fl115h", alternative: null, upgrade: null },
  "rotary-levels_outdoor_survey_long": { best: "geofennel-fl115h", alternative: null, upgrade: null },
  "rotary-levels_outdoor_survey_unsure": { best: "geofennel-fl115h", alternative: null, upgrade: null },
  "rotary-levels_outdoor_unsure_short": { best: "geofennel-fl105h", alternative: "topcon", upgrade: "geofennel-fl115h" },
  "rotary-levels_outdoor_unsure_medium": { best: "geofennel-fl105h", alternative: "topcon", upgrade: "spectra-ll500" },
  "rotary-levels_outdoor_unsure_long": { best: "geofennel-fl115h", alternative: "spectra-ll500", upgrade: null },
  "rotary-levels_outdoor_unsure_unsure": { best: "geofennel-fl105h", alternative: "topcon", upgrade: "spectra-ll500" },
  "rotary-levels_indoor_general": { best: "geofennel-fl105h", alternative: "topcon", upgrade: "geofennel-fl115h" },
  "rotary-levels_indoor_specified": { best: "geofennel-fl115h", alternative: "topcon-h5a", upgrade: null },
  "rotary-levels_indoor_survey": { best: "geofennel-fl115h", alternative: null, upgrade: null },
  "rotary-levels_indoor_unsure": { best: "geofennel-fl105h", alternative: "topcon", upgrade: "geofennel-fl115h" },
  "rotary-levels_both_general_short": { best: "geofennel-fl105h", alternative: "topcon", upgrade: "geofennel-fl115h" },
  "rotary-levels_both_general_medium": { best: "geofennel-fl105h", alternative: "topcon", upgrade: "spectra-ll500" },
  "rotary-levels_both_general_long": { best: "geofennel-fl115h", alternative: "spectra-ll500", upgrade: null },
  "rotary-levels_both_general_unsure": { best: "geofennel-fl105h", alternative: "topcon", upgrade: "spectra-ll500" },
  "rotary-levels_both_specified_short": { best: "geofennel-fl115h", alternative: "topcon-h5a", upgrade: null },
  "rotary-levels_both_specified_medium": { best: "geofennel-fl115h", alternative: "topcon-h5a", upgrade: "spectra-ll500" },
  "rotary-levels_both_specified_long": { best: "geofennel-fl115h", alternative: "spectra-ll500", upgrade: null },
  "rotary-levels_both_specified_unsure": { best: "geofennel-fl115h", alternative: "topcon-h5a", upgrade: "spectra-ll500" },
  "rotary-levels_both_survey_short": { best: "geofennel-fl115h", alternative: null, upgrade: null },
  "rotary-levels_both_survey_medium": { best: "geofennel-fl115h", alternative: null, upgrade: null },
  "rotary-levels_both_survey_long": { best: "geofennel-fl115h", alternative: null, upgrade: null },
  "rotary-levels_both_survey_unsure": { best: "geofennel-fl115h", alternative: null, upgrade: null },
  "rotary-levels_both_unsure_short": { best: "geofennel-fl105h", alternative: "topcon", upgrade: "geofennel-fl115h" },
  "rotary-levels_both_unsure_medium": { best: "geofennel-fl105h", alternative: "topcon", upgrade: "spectra-ll500" },
  "rotary-levels_both_unsure_long": { best: "geofennel-fl115h", alternative: "spectra-ll500", upgrade: null },
  "rotary-levels_both_unsure_unsure": { best: "geofennel-fl105h", alternative: "topcon", upgrade: "spectra-ll500" },
  // LAYOUT: layout_{environment}
  "layout_general": { best: "prodirector7", alternative: "zlp2", upgrade: null },
  "layout_precision": { best: "zlp2", alternative: "prodirector7", upgrade: null },
  "layout_outdoor": { best: "magicline", alternative: null, upgrade: null },
  "layout_unsure": { best: "zlp2", alternative: "prodirector7", upgrade: null },
  // SURVEY: survey
  "survey": { best: "ts01", alternative: null, upgrade: null },
  // RECEIVERS: receiver-type
  "singleline": { best: "geo-fennel-fr-55", alternative: null, upgrade: "onyx-omni-60" },
  "multiline": { best: "geo-fennel-fr-75", alternative: null, upgrade: "onyx-omni-60" },
  "universal": { best: "onyx-omni-60", alternative: "geo-fennel-fr-75", upgrade: null },
};

export const RECOMMENDATION_PATHS: RecommendationMap = {
  find: FIND_PATHS,
  measure: MEASURE_PATHS,
  // position/lasers laser-level lookups are handled separately via lookupLaserRule()
  // in lookupRecommendationPath() below; these tables intentionally omit laser-level keys.
  position: POSITION_PATHS,
  lasers: {},
};

/**
 * Resolve a laser-levels answer set (trade/environment/accuracy/coverage, in that
 * question order) into the {trade, environment, accuracy, coverage} shape
 * lookupLaserRule() expects.
 *
 * `laser-wallmount` (yes/no/unsure) is read directly off `answers` by fixed
 * key rather than through `questionIds`, since it's an optional 5th signal
 * that only narrows the pick when "yes" — keeping it out of the positional
 * questionIds array preserves the original trade/environment/accuracy/
 * coverage contract lookupLaserRule() was verified against.
 */
function laserAnswersFromQuestionIds(answers: Answers, questionIds: string[]) {
  const [tradeId, environmentId, accuracyId, coverageId] = questionIds;
  return {
    trade: (answers[tradeId] || "unknown").toLowerCase(),
    environment: (answers[environmentId] || "unknown").toLowerCase(),
    accuracy: (answers[accuracyId] || "unknown").toLowerCase(),
    coverage: (answers[coverageId] || "unknown").toLowerCase(),
    wallmount: (answers["laser-wallmount"] || "").toLowerCase(),
  };
}

export function lookupRecommendationPath(
  goal: FinderGoal,
  answers: Answers,
  questionIds: string[]
): RecommendationPath | null {
  // Laser levels (both "position" with position-type=laser-levels and the
  // standalone "lasers" goal) route through the rule-based lookup instead of
  // a flat path-key dictionary.
  const isLaserLevels =
    goal === "lasers" || questionIds[0] === "laser-trade";
  if (isLaserLevels) {
    const laserAnswers = laserAnswersFromQuestionIds(answers, questionIds);
    const rule = lookupLaserRule(laserAnswers);
    if (!rule) {
      console.warn(`[Product Finder] No laser rule matched for`, laserAnswers);
      return null;
    }
    return { best: rule.best, alternative: rule.alternative, upgrade: rule.upgrade };
  }

  const pathKey = buildPathKey(answers, questionIds);
  const paths = RECOMMENDATION_PATHS[goal];
  const path = paths[pathKey];

  if (!path) {
    console.warn(`[Product Finder] No recommendation path found for ${goal}/${pathKey}`);
    return null;
  }

  return path;
}

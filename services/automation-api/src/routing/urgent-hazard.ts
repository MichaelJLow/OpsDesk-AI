import type { RequestClassification } from "../schemas/request-classification.js";

export type UrgentHazardRuleId =
  | "water_near_electrics"
  | "gas_or_co_hazard"
  | "active_flooding"
  | "model_urgent_hazardous";

export type RoutePropertyResult = RequestClassification & {
  escalated: boolean;
  chargeable: boolean;
  requiresApproval: boolean;
  matchedRules: UrgentHazardRuleId[];
};

type RouteInput = {
  extraction: RequestClassification;
  rawBody?: string | null;
  subject?: string | null;
};

function haystack(input: RouteInput): string {
  return [
    input.subject ?? "",
    input.rawBody ?? "",
    input.extraction.issueSummary ?? "",
    input.extraction.accessNotes ?? "",
  ]
    .join("\n")
    .toLowerCase();
}

function hasWaterNearElectrics(text: string): boolean {
  const hasWater =
    /\b(water|leak|leaking|flood|flooding|drip|dripping|wet)\b/.test(text);
  const hasElectrics =
    /\b(electric|electrical|electrics|socket|fuse|fusebox|light\s*fitting|ceiling\s*light|wiring|consumer\s*unit|plug)\b/.test(
      text,
    );
  const nearPhrase =
    /\b(water|leak|leaking|flood|wet).{0,40}\b(electric|electrical|electrics|socket|fuse|light|wiring)\b/.test(
      text,
    ) ||
    /\b(electric|electrical|electrics|socket|fuse|light|wiring).{0,40}\b(water|leak|leaking|flood|wet)\b/.test(
      text,
    );
  return nearPhrase || (hasWater && hasElectrics);
}

function hasGasOrCoHazard(text: string): boolean {
  return /\b(gas\s*smell|smell\s*of\s*gas|gas\s*leak|carbon\s*monoxide|\bco\s*alarm|co2?\s*alarm)\b/.test(
    text,
  );
}

function hasActiveFlooding(text: string): boolean {
  return /\b(flooding|flooded|water\s*coming\s*through|ceiling\s*collaps|burst\s*pipe)\b/.test(
    text,
  );
}

/**
 * Deterministic Quayside urgent/hazard escalation.
 * AI may suggest urgency; these rules force the urgent route when matched.
 */
export function applyUrgentHazardRouting(
  input: RouteInput,
): RoutePropertyResult {
  const text = haystack(input);
  const matchedRules: UrgentHazardRuleId[] = [];

  if (hasWaterNearElectrics(text)) matchedRules.push("water_near_electrics");
  if (hasGasOrCoHazard(text)) matchedRules.push("gas_or_co_hazard");
  if (hasActiveFlooding(text)) matchedRules.push("active_flooding");
  if (input.extraction.category === "urgent_hazardous") {
    matchedRules.push("model_urgent_hazardous");
  }

  const escalated = matchedRules.length > 0;
  if (!escalated) {
    return {
      ...input.extraction,
      escalated: false,
      chargeable: false,
      requiresApproval: false,
      matchedRules: [],
    };
  }

  return {
    ...input.extraction,
    category: "urgent_hazardous",
    urgency:
      input.extraction.urgency === "critical"
        ? "critical"
        : input.extraction.urgency === "high"
          ? "high"
          : "high",
    suggestedRoute: "urgent_maintenance",
    escalated: true,
    chargeable: false,
    requiresApproval: false,
    matchedRules,
  };
}

import type { RequestClassification } from "../schemas/request-classification.js";

export type ChargeableRuleId =
  | "tenant_recharge_language"
  | "improvement_works"
  | "model_controlled_chargeable";

export type ChargeableRouteResult = RequestClassification & {
  escalated: boolean;
  chargeable: boolean;
  requiresApproval: boolean;
  matchedRules: ChargeableRuleId[];
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

function hasTenantRechargeLanguage(text: string): boolean {
  return /\b(charge\s*to\s*(the\s*)?tenant|invoice\s*(the\s*)?tenant|recharge|re-?chargeable|chargeable\s*work|bill\s*(the\s*)?tenant)\b/.test(
    text,
  );
}

function hasImprovementWorks(text: string): boolean {
  return (
    /\b(replace|replacing|replacement|fit\s*new|install\s*new)\b.{0,50}\b(carpet|flooring|kitchen|bathroom|tiles?)\b/.test(
      text,
    ) ||
    /\b(new\s+carpet|new\s+flooring|new\s+kitchen)\b/.test(text)
  );
}

/**
 * Deterministic Quayside controlled/chargeable routing.
 * Only applied when urgent/hazard did not escalate.
 */
export function applyControlledChargeableRouting(
  input: RouteInput,
): ChargeableRouteResult {
  const text = haystack(input);
  const matchedRules: ChargeableRuleId[] = [];

  if (hasTenantRechargeLanguage(text)) {
    matchedRules.push("tenant_recharge_language");
  }
  if (hasImprovementWorks(text)) {
    matchedRules.push("improvement_works");
  }
  if (input.extraction.category === "controlled_chargeable") {
    matchedRules.push("model_controlled_chargeable");
  }

  const chargeable = matchedRules.length > 0;
  if (!chargeable) {
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
    category: "controlled_chargeable",
    suggestedRoute: "approval_queue",
    escalated: false,
    chargeable: true,
    requiresApproval: true,
    matchedRules,
  };
}

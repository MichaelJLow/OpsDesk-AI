import type { RequestClassification } from "../schemas/request-classification.js";
import {
  applyControlledChargeableRouting,
  type ChargeableRuleId,
} from "./controlled-chargeable.js";
import {
  applyUrgentHazardRouting,
  type UrgentHazardRuleId,
} from "./urgent-hazard.js";

export type PropertyRouteRuleId = UrgentHazardRuleId | ChargeableRuleId;

export type PropertyRouteResult = RequestClassification & {
  escalated: boolean;
  chargeable: boolean;
  requiresApproval: boolean;
  matchedRules: PropertyRouteRuleId[];
};

type RouteInput = {
  extraction: RequestClassification;
  rawBody?: string | null;
  subject?: string | null;
};

/**
 * Property routing: urgent/hazard wins, then controlled/chargeable, else passthrough.
 */
export function applyPropertyRouting(input: RouteInput): PropertyRouteResult {
  const urgent = applyUrgentHazardRouting(input);
  if (urgent.escalated) {
    return {
      ...urgent,
      chargeable: false,
      requiresApproval: false,
    };
  }

  const chargeable = applyControlledChargeableRouting({
    extraction: urgent,
    rawBody: input.rawBody,
    subject: input.subject,
  });

  return chargeable;
}

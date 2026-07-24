import { z } from "zod";

/**
 * Shared + property-maintenance extraction schema for OpsDesk AI structured LLM output.
 * Invalid output must never be silently accepted (Lesson 7 wires validation).
 */
export const RequestClassificationSchema = z.object({
  vertical: z.literal("property-maintenance"),
  category: z.enum([
    "routine_maintenance",
    "urgent_hazardous",
    "controlled_chargeable",
    "unknown",
  ]),
  confidence: z.number().min(0).max(1),
  urgency: z.enum(["low", "normal", "high", "critical"]),
  siteReference: z.string().nullable(),
  unitReference: z.string().nullable(),
  assetType: z.string().nullable(),
  issueSummary: z.string(),
  accessNotes: z.string().nullable(),
  heatingStillWorking: z.boolean().nullable(),
  missingInformation: z.array(z.string()),
  suggestedRoute: z.enum([
    "maintenance_intake",
    "urgent_maintenance",
    "approval_queue",
    "human_triage",
  ]),
});

export type RequestClassification = z.infer<typeof RequestClassificationSchema>;

export function validateClassification(input: unknown): RequestClassification {
  return RequestClassificationSchema.parse(input);
}

export function safeValidateClassification(input: unknown):
  | { valid: true; data: RequestClassification }
  | { valid: false; errors: z.ZodIssue[] } {
  const result = RequestClassificationSchema.safeParse(input);
  if (result.success) {
    return { valid: true, data: result.data };
  }
  return { valid: false, errors: result.error.issues };
}

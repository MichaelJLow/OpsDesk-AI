import { z } from "zod";

/**
 * Shared classification schema for OpsDesk AI structured LLM output.
 * Invalid output must never be silently accepted.
 */
export const RequestClassificationSchema = z.object({
  category: z.enum(["sales", "support", "account_change", "unknown"]),
  confidence: z.number().min(0).max(1),
  companyName: z.string().nullable(),
  contactName: z.string().nullable(),
  urgency: z.enum(["low", "normal", "high", "critical"]),
  extractedFields: z.record(z.unknown()),
  missingInformation: z.array(z.string()),
  suggestedRoute: z.enum([
    "sales",
    "support",
    "billing_approval",
    "human_triage",
  ]),
  draftReply: z.string(),
});

export type RequestClassification = z.infer<typeof RequestClassificationSchema>;

export function validateClassification(input: unknown): RequestClassification {
  return RequestClassificationSchema.parse(input);
}

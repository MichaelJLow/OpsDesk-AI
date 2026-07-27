import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { applyUrgentHazardRouting } from "./urgent-hazard.js";
import type { RequestClassification } from "../schemas/request-classification.js";

const base: RequestClassification = {
  vertical: "property-maintenance",
  category: "routine_maintenance",
  confidence: 0.8,
  urgency: "normal",
  siteReference: "Riverside Court",
  unitReference: "Flat 8",
  assetType: "boiler",
  issueSummary: "Boiler rattling",
  accessNotes: null,
  heatingStillWorking: true,
  missingInformation: [],
  suggestedRoute: "maintenance_intake",
};

describe("applyUrgentHazardRouting", () => {
  it("leaves routine boiler alone", () => {
    const result = applyUrgentHazardRouting({ extraction: base });
    assert.equal(result.escalated, false);
    assert.equal(result.suggestedRoute, "maintenance_intake");
  });

  it("escalates water near electrics from raw body", () => {
    const result = applyUrgentHazardRouting({
      extraction: base,
      rawBody:
        "There is water dripping onto the light fitting in the hallway.",
    });
    assert.equal(result.escalated, true);
    assert.equal(result.category, "urgent_hazardous");
    assert.equal(result.suggestedRoute, "urgent_maintenance");
    assert.ok(result.matchedRules.includes("water_near_electrics"));
  });

  it("escalates gas smell", () => {
    const result = applyUrgentHazardRouting({
      extraction: {
        ...base,
        issueSummary: "Strong smell of gas in the kitchen",
      },
    });
    assert.equal(result.escalated, true);
    assert.ok(result.matchedRules.includes("gas_or_co_hazard"));
  });

  it("escalates when model already marked urgent_hazardous", () => {
    const result = applyUrgentHazardRouting({
      extraction: {
        ...base,
        category: "urgent_hazardous",
        suggestedRoute: "maintenance_intake",
      },
    });
    assert.equal(result.escalated, true);
    assert.equal(result.suggestedRoute, "urgent_maintenance");
  });
});

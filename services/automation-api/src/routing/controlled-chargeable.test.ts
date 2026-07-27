import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { applyControlledChargeableRouting } from "./controlled-chargeable.js";
import { applyPropertyRouting } from "./property-route.js";
import type { RequestClassification } from "../schemas/request-classification.js";

const base: RequestClassification = {
  vertical: "property-maintenance",
  category: "routine_maintenance",
  confidence: 0.8,
  urgency: "normal",
  siteReference: "Riverside Court",
  unitReference: "Flat 8",
  assetType: "carpet",
  issueSummary: "Carpet worn",
  accessNotes: null,
  heatingStillWorking: null,
  missingInformation: [],
  suggestedRoute: "maintenance_intake",
};

describe("applyControlledChargeableRouting", () => {
  it("flags charge to tenant language", () => {
    const result = applyControlledChargeableRouting({
      extraction: base,
      rawBody:
        "Please replace the hallway carpet and charge to the tenant.",
    });
    assert.equal(result.chargeable, true);
    assert.equal(result.requiresApproval, true);
    assert.equal(result.category, "controlled_chargeable");
    assert.equal(result.suggestedRoute, "approval_queue");
    assert.ok(result.matchedRules.includes("tenant_recharge_language"));
    assert.ok(result.matchedRules.includes("improvement_works"));
  });

  it("flags model controlled_chargeable", () => {
    const result = applyControlledChargeableRouting({
      extraction: {
        ...base,
        category: "controlled_chargeable",
        suggestedRoute: "maintenance_intake",
      },
    });
    assert.equal(result.chargeable, true);
    assert.ok(result.matchedRules.includes("model_controlled_chargeable"));
  });

  it("leaves routine boiler alone", () => {
    const result = applyControlledChargeableRouting({
      extraction: {
        ...base,
        assetType: "boiler",
        issueSummary: "Boiler rattling",
      },
      rawBody: "Boiler rattling, heating still works.",
    });
    assert.equal(result.chargeable, false);
    assert.equal(result.requiresApproval, false);
  });
});

describe("applyPropertyRouting", () => {
  it("urgent wins over chargeable language", () => {
    const result = applyPropertyRouting({
      extraction: base,
      rawBody:
        "Water dripping onto the light fitting — also please charge carpet to tenant.",
    });
    assert.equal(result.escalated, true);
    assert.equal(result.chargeable, false);
    assert.equal(result.suggestedRoute, "urgent_maintenance");
  });

  it("routes chargeable when not urgent", () => {
    const result = applyPropertyRouting({
      extraction: base,
      subject: "Replace carpet Flat 8",
      rawBody: "Please replace the hallway carpet and charge to the tenant.",
    });
    assert.equal(result.escalated, false);
    assert.equal(result.chargeable, true);
    assert.equal(result.suggestedRoute, "approval_queue");
  });
});

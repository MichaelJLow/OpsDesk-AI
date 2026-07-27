import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { retrieveKnowledge } from "./search.js";

describe("retrieveKnowledge", () => {
  it("returns chargeable policy for carpet / tenant charge query", () => {
    const hits = retrieveKnowledge(
      "Replace hallway carpet Flat 8 charge to the tenant",
    );
    assert.ok(hits.length > 0);
    assert.equal(hits[0]?.id, "pol-chargeable-works");
  });

  it("returns urgent policy for water near electrics", () => {
    const hits = retrieveKnowledge(
      "water dripping onto the light fitting electrics hazard",
    );
    assert.ok(hits.length > 0);
    assert.equal(hits[0]?.id, "pol-urgent-hazard");
  });

  it("returns boiler warranty for routine boiler rattle", () => {
    const hits = retrieveKnowledge(
      "boiler rattling Riverside Court heating still works",
    );
    assert.ok(hits.length > 0);
    assert.ok(
      hits.some((h) => h.id === "pol-boiler-warranty"),
      "expected boiler warranty in hits",
    );
  });

  it("returns empty for blank query", () => {
    assert.deepEqual(retrieveKnowledge("   "), []);
  });
});

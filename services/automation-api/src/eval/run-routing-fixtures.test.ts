import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { applyPropertyRouting } from "../routing/property-route.js";
import type { RequestClassification } from "../schemas/request-classification.js";

type RoutingFixture = {
  id: string;
  description?: string;
  subject?: string | null;
  rawBody?: string | null;
  extraction: RequestClassification;
  expected: {
    escalated: boolean;
    chargeable: boolean;
    requiresApproval: boolean;
    suggestedRoute: string;
    category?: string;
  };
};

const here = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.resolve(
  here,
  "../../../../evaluation/fixtures/property-routing",
);

async function loadFixtures(): Promise<RoutingFixture[]> {
  const names = (await readdir(fixturesDir))
    .filter((name) => name.endsWith(".json"))
    .sort();
  const fixtures: RoutingFixture[] = [];
  for (const name of names) {
    const raw = await readFile(path.join(fixturesDir, name), "utf8");
    fixtures.push(JSON.parse(raw) as RoutingFixture);
  }
  return fixtures;
}

describe("property routing fixtures", async () => {
  const fixtures = await loadFixtures();

  assert.ok(
    fixtures.length >= 6,
    `expected at least 6 fixtures, found ${fixtures.length} in ${fixturesDir}`,
  );

  for (const fixture of fixtures) {
    it(`${fixture.id}: ${fixture.description ?? "route assertion"}`, () => {
      const result = applyPropertyRouting({
        extraction: fixture.extraction,
        rawBody: fixture.rawBody,
        subject: fixture.subject,
      });

      assert.equal(
        result.escalated,
        fixture.expected.escalated,
        `${fixture.id} escalated`,
      );
      assert.equal(
        result.chargeable,
        fixture.expected.chargeable,
        `${fixture.id} chargeable`,
      );
      assert.equal(
        result.requiresApproval,
        fixture.expected.requiresApproval,
        `${fixture.id} requiresApproval`,
      );
      assert.equal(
        result.suggestedRoute,
        fixture.expected.suggestedRoute,
        `${fixture.id} suggestedRoute`,
      );
      if (fixture.expected.category !== undefined) {
        assert.equal(
          result.category,
          fixture.expected.category,
          `${fixture.id} category`,
        );
      }
    });
  }
});

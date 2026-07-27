import { createServer } from "node:http";
import { health } from "./index.js";
import { retrieveKnowledge, buildRetrievalQuery, enrichDraftWithCitations, formatCitationBlock } from "./retrieval/search.js";
import { applyPropertyRouting } from "./routing/property-route.js";
import {
  safeValidateClassification,
  type RequestClassification,
} from "./schemas/request-classification.js";

const port = Number(process.env.AUTOMATION_API_PORT ?? 3040);

function readJson(req: import("node:http").IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function send(
  res: import("node:http").ServerResponse,
  status: number,
  body: unknown,
) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  });
  res.end(payload);
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://localhost:${port}`);

  if (req.method === "OPTIONS") {
    send(res, 204, {});
    return;
  }

  if (req.method === "GET" && url.pathname === "/health") {
    send(res, 200, health());
    return;
  }

  if (req.method === "POST" && url.pathname === "/v1/validate/extraction") {
    try {
      const body = (await readJson(req)) as {
        structured_output?: unknown;
      };
      const input =
        body && typeof body === "object" && "structured_output" in body
          ? body.structured_output
          : body;
      const result = safeValidateClassification(input);
      send(res, 200, result);
    } catch {
      send(res, 400, {
        valid: false,
        errors: [{ message: "Request body must be valid JSON" }],
      });
    }
    return;
  }

  if (req.method === "POST" && url.pathname === "/v1/route/property") {
    try {
      const body = (await readJson(req)) as {
        structured_output?: unknown;
        raw_body?: string | null;
        subject?: string | null;
      };
      const candidate =
        body && typeof body === "object" && "structured_output" in body
          ? body.structured_output
          : body;
      const validated = safeValidateClassification(candidate);
      if (!validated.valid) {
        send(res, 400, validated);
        return;
      }
      const routed = applyPropertyRouting({
        extraction: validated.data as RequestClassification,
        rawBody: body.raw_body,
        subject: body.subject,
      });
      send(res, 200, routed);
    } catch {
      send(res, 400, {
        error: "Request body must be valid JSON",
      });
    }
    return;
  }

  if (req.method === "POST" && url.pathname === "/v1/retrieve") {
    try {
      const body = (await readJson(req)) as {
        query?: string;
        limit?: number;
      };
      const query = typeof body.query === "string" ? body.query : "";
      const limit =
        typeof body.limit === "number" && body.limit > 0
          ? Math.min(body.limit, 10)
          : 3;
      const hits = retrieveKnowledge(query, { limit });
      send(res, 200, {
        query,
        hits,
        citationBlock: formatCitationBlock(hits),
      });
    } catch {
      send(res, 400, { error: "Request body must be valid JSON" });
    }
    return;
  }

  if (req.method === "POST" && url.pathname === "/v1/draft/with-citations") {
    try {
      const body = (await readJson(req)) as {
        draftText?: string;
        query?: string;
        subject?: string | null;
        raw_body?: string | null;
        structured_output?: {
          issueSummary?: string;
          category?: string;
          assetType?: string;
          siteReference?: string | null;
        } | null;
        limit?: number;
      };
      const draftText =
        typeof body.draftText === "string" ? body.draftText.trim() : "";
      if (!draftText) {
        send(res, 400, { error: "draftText is required" });
        return;
      }
      const so = body.structured_output ?? null;
      const query =
        typeof body.query === "string" && body.query.trim()
          ? body.query.trim()
          : buildRetrievalQuery({
              subject: body.subject,
              issueSummary: so?.issueSummary,
              category: so?.category,
              assetType: so?.assetType,
              siteReference: so?.siteReference,
              rawBody: body.raw_body,
            });
      const limit =
        typeof body.limit === "number" && body.limit > 0
          ? Math.min(body.limit, 10)
          : 3;
      const hits = retrieveKnowledge(query, { limit });
      const enriched = enrichDraftWithCitations({ draftText, hits });
      send(res, 200, {
        query,
        hits,
        citationBlock: formatCitationBlock(hits),
        draftText: enriched,
      });
    } catch {
      send(res, 400, { error: "Request body must be valid JSON" });
    }
    return;
  }

  send(res, 404, { error: "Not found" });
});

const host = process.env.AUTOMATION_API_HOST ?? "0.0.0.0";

server.listen(port, host, () => {
  console.log(`automation-api listening on http://${host}:${port}`);
  console.log(`  GET  /health`);
  console.log(`  POST /v1/validate/extraction`);
  console.log(`  POST /v1/route/property`);
  console.log(`  POST /v1/retrieve`);
  console.log(`  POST /v1/draft/with-citations`);
});

import { createServer } from "node:http";
import { health } from "./index.js";
import { safeValidateClassification } from "./schemas/request-classification.js";

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

  send(res, 404, { error: "Not found" });
});

const host = process.env.AUTOMATION_API_HOST ?? "0.0.0.0";

server.listen(port, host, () => {
  console.log(`automation-api listening on http://${host}:${port}`);
  console.log(`  GET  /health`);
  console.log(`  POST /v1/validate/extraction`);
});

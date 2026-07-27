import { QUAYSIDE_CORPUS, type KnowledgeDoc } from "./corpus";

export type RetrievalHit = {
  id: string;
  title: string;
  namespace: string;
  score: number;
  snippet: string;
};

const STOP = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "to",
  "of",
  "in",
  "on",
  "for",
  "is",
  "at",
  "please",
  "hi",
  "hello",
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP.has(t));
}

function snippetFor(doc: KnowledgeDoc, terms: string[]): string {
  const lower = doc.body.toLowerCase();
  let bestIdx = 0;
  for (const term of terms) {
    const idx = lower.indexOf(term);
    if (idx >= 0) {
      bestIdx = Math.max(0, idx - 40);
      break;
    }
  }
  const slice = doc.body.slice(bestIdx, bestIdx + 180).trim();
  return (bestIdx > 0 ? "…" : "") + slice + (bestIdx + 180 < doc.body.length ? "…" : "");
}

/**
 * Deterministic keyword retrieval over the Quayside lab corpus.
 * No embeddings / pgvector in this slice (scope-and-metrics).
 */
export function retrieveKnowledge(
  query: string,
  opts?: { limit?: number; corpus?: KnowledgeDoc[] },
): RetrievalHit[] {
  const limit = opts?.limit ?? 3;
  const corpus = opts?.corpus ?? QUAYSIDE_CORPUS;
  const terms = tokenize(query);
  if (terms.length === 0) return [];

  const scored = corpus
    .map((doc) => {
      const hay = tokenize(
        [doc.title, doc.namespace, doc.tags.join(" "), doc.body].join(" "),
      );
      const haySet = new Set(hay);
      let score = 0;
      for (const term of terms) {
        if (haySet.has(term)) score += 2;
        else if (hay.some((h) => h.includes(term) || term.includes(h))) score += 1;
        if (doc.tags.some((t) => t === term)) score += 2;
      }
      return {
        id: doc.id,
        title: doc.title,
        namespace: doc.namespace,
        score,
        snippet: snippetFor(doc, terms),
      };
    })
    .filter((h) => h.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

  return scored.slice(0, limit);
}

export function buildRetrievalQuery(parts: {
  subject?: string | null;
  issueSummary?: string | null;
  category?: string | null;
  assetType?: string | null;
  siteReference?: string | null;
  rawBody?: string | null;
}): string {
  return [
    parts.subject,
    parts.issueSummary,
    parts.category,
    parts.assetType,
    parts.siteReference,
    parts.rawBody?.slice(0, 280),
  ]
    .filter(Boolean)
    .join(" ");
}

/** Footnotes block appended to operator-facing draft emails. */
export function formatCitationBlock(hits: RetrievalHit[]): string {
  if (hits.length === 0) return "";
  const lines = hits.map(
    (hit, i) =>
      `[${i + 1}] ${hit.title} (${hit.id}) — ${hit.snippet.replace(/\s+/g, " ").trim()}`,
  );
  return ["", "—", "Sources (OpsDesk lab policies):", ...lines].join("\n");
}

export function enrichDraftWithCitations(input: {
  draftText: string;
  hits: RetrievalHit[];
}): string {
  const base = input.draftText.trim();
  const block = formatCitationBlock(input.hits);
  if (!block) return base;
  if (base.includes("Sources (OpsDesk lab policies):")) return base;
  return `${base}\n${block}`;
}


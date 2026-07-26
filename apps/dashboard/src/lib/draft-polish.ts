/**
 * Light polish before protected send — placeholders, layout, HTML for Gmail.
 */

export function recipientDisplayName(
  email: string | null | undefined,
  contactName?: string | null,
): string {
  const fromContact = contactName?.trim();
  if (fromContact) {
    const first = fromContact.split(/\s+/)[0];
    if (first) return first;
  }

  if (!email) return "there";

  const local = email.split("@")[0] ?? "";
  const beforePlus = local.split("+")[0] ?? local;
  const token = beforePlus.split(/[._-]/)[0] ?? "";
  const letters = token.replace(/[0-9]/g, "");
  if (letters.length >= 2) {
    return letters.charAt(0).toUpperCase() + letters.slice(1).toLowerCase();
  }

  return "there";
}

export function polishDraftText(
  raw: string,
  email: string | null | undefined,
  contactName?: string | null,
): string {
  const name = recipientDisplayName(email, contactName);
  let text = raw.trim();

  text = text
    .replace(/\[recipient name\]/gi, name)
    .replace(/\[name\]/gi, name)
    .replace(/\[customer name\]/gi, name)
    .replace(/Dear\s+Recipient\b/gi, `Dear ${name}`);

  // Collapse soft wrapping into a single pass, then rebuild paragraphs if needed
  if (!/\r?\n/.test(text)) {
    text = layoutSingleLineDraft(text, name);
  } else {
    text = text
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  return text;
}

function layoutSingleLineDraft(text: string, name: string): string {
  let t = text.replace(/\s+/g, " ").trim();

  const greetingMatch = t.match(/^dear\s+[^,]+,\s*/i);
  let greeting = `Dear ${name},`;
  let rest = t;
  if (greetingMatch) {
    greeting = greetingMatch[0].replace(/,\s*$/, ",");
    rest = t.slice(greetingMatch[0].length).trim();
  }

  const signoffMatch = rest.match(
    /\s*kind regards[,.]?\s*(quayside property services)?\s*$/i,
  );
  let body = rest;
  if (signoffMatch) {
    body = rest.slice(0, signoffMatch.index).trim();
  }

  return [
    greeting,
    "",
    body,
    "",
    "Kind regards,",
    "Quayside Property Services",
  ].join("\n");
}

export function draftTextToHtml(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped.replace(/\r\n|\r|\n/g, "<br>\n");
}

import { ensureServerEnv } from "@/lib/supabase/admin";

export type HubSpotContactSummary = {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  phone: string | null;
  jobTitle: string | null;
  company: string | null;
};

type HubSpotSearchResponse = {
  results?: Array<{
    id: string;
    properties?: Record<string, string | null | undefined>;
  }>;
};

/**
 * Live HubSpot contact search by email (Private App token).
 * Returns null when token missing, no match, or API error (panel shows empty state).
 */
export async function lookupHubSpotContactByEmail(
  email: string,
): Promise<HubSpotContactSummary | null> {
  ensureServerEnv();
  const token = process.env.HUBSPOT_ACCESS_TOKEN?.trim();
  if (!token || !email.trim()) {
    return null;
  }

  try {
    const response = await fetch(
      "https://api.hubapi.com/crm/v3/objects/contacts/search",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filterGroups: [
            {
              filters: [
                {
                  propertyName: "email",
                  operator: "EQ",
                  value: email.trim(),
                },
              ],
            },
          ],
          properties: [
            "email",
            "firstname",
            "lastname",
            "phone",
            "jobtitle",
            "company",
          ],
          limit: 1,
        }),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as HubSpotSearchResponse;
    const hit = data.results?.[0];
    if (!hit) {
      return null;
    }

    const p = hit.properties ?? {};
    const firstName = p.firstname?.trim() || null;
    const lastName = p.lastname?.trim() || null;
    const fullName =
      [firstName, lastName].filter(Boolean).join(" ").trim() || null;

    return {
      id: hit.id,
      email: p.email?.trim() || email.trim(),
      firstName,
      lastName,
      fullName,
      phone: p.phone?.trim() || null,
      jobTitle: p.jobtitle?.trim() || null,
      company: p.company?.trim() || null,
    };
  } catch {
    return null;
  }
}

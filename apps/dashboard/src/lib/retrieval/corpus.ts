export type KnowledgeDoc = {
  id: string;
  title: string;
  namespace: string;
  tags: string[];
  body: string;
};

/** Quayside lab corpus — keyword retrieval only (no embeddings). Keep in sync with automation-api copy. */
export const QUAYSIDE_CORPUS: KnowledgeDoc[] = [
  {
    id: "pol-chargeable-works",
    title: "Chargeable / rechargeable works policy",
    namespace: "policy",
    tags: [
      "chargeable",
      "tenant",
      "carpet",
      "flooring",
      "improvement",
      "approval",
      "invoice",
    ],
    body: [
      "Improvements such as carpet or flooring replacement that are charged to the tenant are controlled works.",
      "Do not instruct contractors or raise invoices until an authorised operator has approved the proposed action.",
      "Approval records landlord authority only; execution (work order) and billing remain separate steps.",
      "Lab note: no live accounting integration in this demo.",
    ].join(" "),
  },
  {
    id: "pol-urgent-hazard",
    title: "Urgent hazard escalation policy",
    namespace: "policy",
    tags: [
      "urgent",
      "hazard",
      "water",
      "electrics",
      "gas",
      "co",
      "flood",
      "safety",
    ],
    body: [
      "Water near electrical fittings, smell of gas, carbon monoxide alarms, or uncontrolled flooding are urgent hazards.",
      "Route to urgent maintenance immediately. Do not wait for routine SLA windows.",
      "OpsDesk must not fabricate contractor dispatch; escalate for human follow-up.",
      "Urgent routing wins over chargeable language when both appear in the same message.",
    ].join(" "),
  },
  {
    id: "pol-boiler-warranty",
    title: "Boiler warranty and routine maintenance",
    namespace: "warranty",
    tags: [
      "boiler",
      "heating",
      "warranty",
      "rattle",
      "routine",
      "riverside",
    ],
    body: [
      "Riverside Court boilers under active warranty: rattling or noise with heating still working is treated as routine maintenance.",
      "Confirm heatingStillWorking when possible. Book a weekday engineer visit; no urgent escalation unless heat is lost in cold weather or a gas/CO hazard is present.",
      "Cite this note when drafting acknowledgements for routine boiler faults.",
    ].join(" "),
  },
  {
    id: "pol-access-riverside",
    title: "Riverside Court access notes",
    namespace: "site",
    tags: ["riverside", "access", "flat", "weekday", "entry"],
    body: [
      "Riverside Court: preferred contractor access weekdays after 09:00 unless the resident states otherwise.",
      "Use the unit reference from extraction when present. Concierge can arrange key access for voids; tenanted flats require resident confirmation.",
    ].join(" "),
  },
];

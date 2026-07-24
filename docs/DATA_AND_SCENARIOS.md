# Data and Scenarios — Quayside Property Services

## Synthetic volumes (Phase 2 target)

- ~25 client organisations  
- ~50 sites/properties  
- ~60 contacts  
- ~12 contractors / service providers  
- Selected assets (boilers, roofs, electrics, …)  
- Agreements, warranties, prior requests, policies  
- 10 curated edge-case clients/sites  

Use a fixed random seed. Clearly fictional; resettable.

## Edge cases (include)

Unknown sender; contact on multiple properties; tenant can report but not approve spend; low approval threshold; active boiler warranty; repeat roof leak under contractor warranty; emergency electrical notes; expired agreement; no approved contractor for trade; ambiguous unit reference; contractor unavailable; conflicting authorisation records.

## Request categories

1. Routine maintenance  
2. Urgent / hazardous  
3. Controlled / chargeable / authorisation-sensitive  
4. Unknown / triage  

## Evaluation layout (planned)

```text
evaluation/
├── shared/          # duplicate, invalid JSON, integration failure, …
├── property-maintenance/
└── inspection-services/   # post-MVP
```

## Expected-answer fixture (conceptual)

```json
{
  "vertical": "property-maintenance",
  "expectedCategory": "routine_maintenance",
  "expectedRoute": "maintenance_intake",
  "mustRequireApproval": false,
  "allowedActions": ["draft_reply", "notify_slack"],
  "prohibitedActions": ["dispatch_contractor_without_policy"],
  "expectedFields": {
    "siteReference": "Riverside Court",
    "unitReference": "Flat 8",
    "assetType": "boiler"
  }
}
```

## Schema note

Current tables (`companies`, `contacts`, `requests`, …) remain until a reviewed migration adds `sites`, `assets`, `jobs`, etc. Do not invent production migrations in ad-hoc sessions.

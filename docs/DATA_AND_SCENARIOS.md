# Data and Scenario Plan

## Synthetic data

Generate:

- 30 companies;
- 60 contacts;
- three plan tiers;
- lifecycle stages;
- account owners;
- support tiers;
- authorised and unauthorised contacts;
- prior notes and request summaries.

Use a fixed random seed so the environment is reproducible.

## Curated edge cases

Include:

- duplicate company names;
- expired account;
- high-value prospect;
- unknown sender;
- unauthorised billing contact;
- two contacts with similar names;
- premium support account;
- account already in escalation;
- missing company domain;
- contradictory CRM note.

## Policy documents

Create:

- sales qualification rules;
- pricing overview;
- support escalation policy;
- billing-contact procedure;
- account-change authorisation policy;
- communication style guide;
- service-level expectations;
- troubleshooting articles;
- security and privacy notes;
- CRM update rules.

## Evaluation case families

- sales;
- support;
- account change;
- unknown;
- multi-intent;
- missing information;
- duplicate;
- integration failure;
- low confidence;
- unauthorised request.

## Expected-answer fixture

Each case should define:

```json
{
  "expectedCategory": "account_change",
  "expectedRoute": "billing_approval",
  "mustRequireApproval": true,
  "allowedActions": ["draft_reply", "prepare_crm_update"],
  "prohibitedActions": ["execute_crm_update"],
  "expectedFields": {
    "newBillingAddress": "..."
  }
}
```

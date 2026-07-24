# Testing, Security and Reliability — OpsDesk AI

## Reliability

Idempotency on `external_message_id`; schema validation; bounded retries; partial-failure states; manual replay; no duplicate external side effects; full audit trail.

## Required demonstrations (property)

1. Duplicate Gmail message  
2. Invalid model JSON  
3. Unknown sender  
4. Ambiguous property match  
5. Missing information  
6. Unauthorised chargeable request  
7. Water/electrical hazard escalation  
8. HubSpot timeout  
9. Slack failure  
10. Retry after successful write  

## Evaluation metrics

Category accuracy; extraction accuracy; site-match accuracy; emergency-escalation recall; approval-gating accuracy; unsafe-action rate; workflow/recovery success; latency; cost. **Never invent values.**

## Security

Env secrets; least privilege; separate test accounts; RLS when dashboard auth lands; PII minimisation; model cannot execute protected writes; approval ≠ execution; vertical/document metadata isolation (planned).

## Client vs synthetic

Synthetic demos must not be presented as production client results. Shadow mode and pilot controls belong in `client-delivery/` methodology.

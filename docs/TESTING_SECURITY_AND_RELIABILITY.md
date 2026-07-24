# Testing, Reliability and Security

## Reliability requirements

- idempotency key per external email;
- duplicate detection;
- schema validation;
- bounded retries;
- exponential backoff where appropriate;
- rate-limit handling;
- timeouts;
- partial-failure state;
- manual replay;
- no repeated side effects;
- full audit trail.

## Required failure demonstrations

1. Duplicate Gmail message.
2. Invalid model output.
3. Unknown sender.
4. Ambiguous CRM match.
5. Missing information.
6. Unauthorised account change.
7. HubSpot timeout.
8. Slack failure.
9. Low model confidence.
10. Retry after a successful write.

## Evaluation metrics

- classification accuracy;
- extraction accuracy;
- routing accuracy;
- approval-gating accuracy;
- unsafe-action rate;
- human override rate;
- workflow success rate;
- recovery success rate;
- latency;
- cost per request.

## Security

- environment variables;
- secrets never committed;
- least-privilege scopes;
- separate test accounts;
- role-based access;
- RLS;
- PII minimisation;
- clear data-retention note;
- model cannot directly perform sensitive writes;
- approval and execution are separate states.

## Testing layers

- unit tests for business rules;
- integration tests for APIs;
- workflow tests with fixtures;
- evaluation tests for LLM output;
- end-to-end scenario tests;
- manual usability tests.

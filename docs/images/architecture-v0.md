# Architecture draft v0 (EVID-003)

Source diagram for portfolio export. Export to `architecture-v0.png` when ready.

```mermaid
flowchart LR
  gmail[Gmail]
  n8n[n8n]
  llm[LLM]
  api[TypeScript rules]
  sb[Supabase]
  hs[HubSpot]
  slack[Slack]
  dash[Next.js dashboard]

  gmail --> n8n
  n8n --> sb
  n8n --> llm
  llm --> api
  api --> n8n
  n8n --> hs
  n8n --> slack
  sb --> dash
```

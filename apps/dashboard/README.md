# OpsDesk dashboard (local)

Quayside operator desk — inbox, request workspace, draft approve/reject.

## Run

From repo root, ensure `.env` has:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

`next.config.ts` loads env from the monorepo root (no need to duplicate into this folder unless you prefer `.env.local` here).

```powershell
cd apps/dashboard
npm run dev
```

Open http://localhost:3000

## Lab notes

- No login yet — local sandbox only; service role stays on the server.
- Approve/Reject updates `proposed_actions` and inserts `approvals`. Does not send email by itself.
- **Send reply** (only when status is `approved`) calls `N8N_SEND_WEBHOOK_URL` — set that in the monorepo root `.env` after creating the n8n webhook workflow.
- Data comes from the n8n pipeline writing to Supabase.

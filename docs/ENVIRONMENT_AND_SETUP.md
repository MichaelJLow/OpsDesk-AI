# Environment and Setup Checklist

## Local development

- [ ] Install Docker Desktop.
- [ ] Enable WSL 2 backend.
- [ ] Create persistent `n8n_data` Docker volume.
- [ ] Start n8n on `http://localhost:5678`.
- [ ] Confirm workflow persists after restart.
- [ ] Create Node.js LTS environment.
- [ ] Create Python virtual environment.
- [ ] Install Git.

## Accounts

- [ ] Gmail test inbox.
- [ ] HubSpot developer test account.
- [ ] Slack test workspace.
- [ ] Supabase free project.
- [ ] One LLM API account.
- [ ] GitHub repository.
- [ ] Vercel account.
- [ ] Sentry free project.

## Slack channels

- [ ] `#sales-enquiries`
- [ ] `#customer-support`
- [ ] `#billing-approvals`
- [ ] `#automation-alerts`

## Environment variables

See root `.env.example` and the living checklist in `ACCOUNT_SETUP_CHECKLIST.md`.

- [ ] `DATABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `HUBSPOT_ACCESS_TOKEN`
- [ ] `SLACK_BOT_TOKEN`
- [ ] `SLACK_SIGNING_SECRET`
- [ ] `GMAIL_CLIENT_ID`
- [ ] `GMAIL_CLIENT_SECRET`
- [ ] model-provider API key (`GEMINI_API_KEY` initially)
- [ ] `SENTRY_DSN`

## Local n8n Docker example

```powershell
docker volume create n8n_data

docker run -it --rm `
  --name n8n `
  -p 5678:5678 `
  -v n8n_data:/home/node/.n8n `
  docker.n8n.io/n8nio/n8n
```

For a longer-running setup, replace the temporary `--rm` workflow with Docker Compose and restart policies.

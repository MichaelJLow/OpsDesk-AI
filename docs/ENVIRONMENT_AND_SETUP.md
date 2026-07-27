# Environment and Setup — OpsDesk AI

## Local development

- [x] Docker Desktop + WSL2  
- [x] n8n via `n8n/docker-compose.yml` → http://localhost:5678  
- [x] Node.js LTS; Next.js dashboard  
- [ ] Python venv (Phase 2 seeds)  
- [x] Git  

## Accounts

- [x] Gmail plus-alias OpsDesk label  
- [x] Supabase (schema applied; keys in local `.env`)  
- [ ] HubSpot developer account  
- [ ] Slack test workspace  
- [ ] Gemini (or chosen LLM)  
- [x] GitHub `MichaelJLow/OpsDesk-AI`  
- [ ] Vercel / Sentry as needed  

## Slack channels (property)

- [ ] `#maintenance-intake`  
- [ ] `#maintenance-intake`
- [ ] `#urgent-maintenance`  
- [ ] `#approval-queue`  
- [ ] `#automation-alerts`  

## Synthetic vs real client

Local sandbox uses synthetic Quayside data and test credentials. A real-client deployment requires separate discovery, credential ownership, least privilege and acceptance criteria — see `client-delivery/`.

## n8n Docker

See `n8n/README.md`. Local TLS workaround (DEC-008) is **not** for hosted environments.

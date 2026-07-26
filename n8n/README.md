# n8n (local + VPS)

## VPS (production lab)

| Item | Value |
|---|---|
| UI | https://n8n.michaeljlow.com |
| Owner login | `mikelow92@gmail.com` |
| SSH | `ssh root@46.225.225.118 -p 48482` |
| Container | `opsdesk-n8n` (data: `/home/hermes/n8n-data`) |
| Zod API | `opsdesk-automation-api` — see `services/automation-api/docker-compose.yml` |
| Validate URL (from n8n) | `http://opsdesk-automation-api:3040/v1/validate/extraction` |

Keep local Docker unpublished when VPS intake is published (same Gmail + same Supabase).

## Local start

```powershell
docker compose -f n8n/docker-compose.yml up -d
```

Open http://localhost:5678

## Persist after restart

Data is stored in the Docker volume `opsdesk_n8n_data`. After creating a test workflow, restart the container and confirm the workflow remains:

```powershell
docker compose -f n8n/docker-compose.yml restart
```

## Stop

```powershell
docker compose -f n8n/docker-compose.yml down
```

Do not use `down -v` unless you intend to delete workflow data.

## Local TLS note (DEC-008 / FAIL-001)

If Google OAuth or “Error fetching options from Gmail” appears with `unable to verify the first certificate`, this compose file sets `NODE_TLS_REJECT_UNAUTHORIZED=0` for **local learning only**. Recreate with:

```powershell
docker compose -f n8n/docker-compose.yml up -d --force-recreate
```

Do not use that setting on a hosted/shared n8n.


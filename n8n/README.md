# Local n8n

## Start

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


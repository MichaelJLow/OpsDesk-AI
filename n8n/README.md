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

## Export workflows

Export sanitised JSON into `n8n/workflows/`. Never commit credentials.

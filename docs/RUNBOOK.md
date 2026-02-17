# Skiploom Runbook

Operational procedures for the Skiploom system.

## Secrets Rotation

When secrets need to be rotated (e.g., after a compromise or as routine maintenance):

1. **Read the current PostgreSQL password** from `secrets/postgres_password` (needed to connect to the running database).
2. **Regenerate local secrets** by running `bash scripts/generate-secrets.sh` and confirming the overwrite. This produces new random values for `postgres_password` and `spring.datasource.password`.
3. **Update the running PostgreSQL password** to match the newly generated value:
   ```bash
   PGPASSWORD='<old_password>' docker exec skiploom-postgres-1 \
     psql -U postgres -c "ALTER USER postgres WITH PASSWORD '<new_password>';"
   ```
   PostgreSQL only reads `POSTGRES_PASSWORD_FILE` during initial database creation. After initialization, the password lives in PostgreSQL's catalog and must be updated with `ALTER USER`.
4. **Regenerate Google OAuth2 credentials** in [Google Cloud Console](https://console.cloud.google.com/apis/credentials) and write the new values into the corresponding secret files.
5. **Verify services**:
   - `docker compose config` — static validation of compose configuration
   - `docker compose up -d` — non-destructive restart; verify all services start healthy

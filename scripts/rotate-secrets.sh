#!/bin/bash
#
# Rotate secrets for a running Skiploom system.
#
# Rotates:
#   - PostgreSQL / Spring datasource password (fully automated)
#   - Google OAuth2 client credentials (automated via gcloud, with manual fallback)
#
# Prerequisites:
#   - secrets/ directory with existing secret files
#   - Running PostgreSQL container (skiploom-postgres-1)
#   - openssl (for password generation)
#   - gcloud (optional, for automated OAuth2 rotation)
#
# Usage:
#   bash scripts/rotate-secrets.sh
#
set -euo pipefail

SECRETS_DIR="secrets"
POSTGRES_CONTAINER="skiploom-postgres-1"

# --- Precondition checks ---

if [ ! -d "${SECRETS_DIR}" ]; then
  echo "ERROR: ${SECRETS_DIR}/ does not exist. Run scripts/generate-secrets.sh first."
  exit 1
fi

if ! command -v openssl &> /dev/null; then
  echo "ERROR: openssl is required but not found."
  exit 1
fi

if ! docker inspect --format '{{.State.Running}}' "${POSTGRES_CONTAINER}" 2>/dev/null | grep -q true; then
  echo "ERROR: PostgreSQL container '${POSTGRES_CONTAINER}' is not running."
  exit 1
fi

GCLOUD_AVAILABLE=false
if command -v gcloud &> /dev/null; then
  GCLOUD_AVAILABLE=true
fi

# --- Confirmation ---

echo "This will rotate secrets for the running system. Continue? [y/N]"
read -rp "" answer
if [[ ! "${answer}" =~ ^[Yy]$ ]]; then
  echo "Aborted."
  exit 0
fi

# --- Database password rotation ---

echo "=== Rotating database password ==="

OLD_PASSWORD=$(cat "${SECRETS_DIR}/postgres_password")

generate_password() {
  openssl rand -base64 24 | tr -d '/+='
}

NEW_PASSWORD=$(generate_password)

echo "Updating PostgreSQL catalog password..."
docker exec -e PGPASSWORD="${OLD_PASSWORD}" "${POSTGRES_CONTAINER}" \
  psql -U postgres -c "ALTER USER postgres WITH PASSWORD '${NEW_PASSWORD}';"

echo "Writing new password to secret files..."
echo -n "${NEW_PASSWORD}" > "${SECRETS_DIR}/postgres_password"
echo -n "${NEW_PASSWORD}" > "${SECRETS_DIR}/spring.datasource.password"

echo "Database password rotated."

# --- Google OAuth2 credential rotation ---

echo ""
echo "=== Rotating Google OAuth2 credentials ==="

OAUTH2_STATUS="skipped"

if [ "${GCLOUD_AVAILABLE}" = true ] \
  && [ -n "${GCLOUD_PROJECT_ID:-}" ] \
  && [ -n "${GCLOUD_OAUTH_CLIENT_ID:-}" ]; then

  echo "Attempting automated rotation via gcloud..."

  if NEW_CLIENT_SECRET=$(gcloud iam oauth-clients credentials create \
    --oauth-client="${GCLOUD_OAUTH_CLIENT_ID}" \
    --display-name="rotated-$(date +%Y%m%d-%H%M%S)" \
    --location=global \
    --project="${GCLOUD_PROJECT_ID}" \
    --format='value(clientSecret)' 2>&1); then

    echo -n "${NEW_CLIENT_SECRET}" > "${SECRETS_DIR}/spring.security.oauth2.client.registration.google.client-secret"
    echo "Google OAuth2 client secret rotated via gcloud."
    OAUTH2_STATUS="rotated (automated via gcloud)"

    echo "NOTE: Old credential may still be active. Review and delete old credentials:"
    echo "  gcloud iam oauth-clients credentials list --oauth-client=${GCLOUD_OAUTH_CLIENT_ID} --location=global --project=${GCLOUD_PROJECT_ID}"
  else
    echo "WARNING: gcloud credential creation failed. Falling back to manual rotation."
    echo "  ${NEW_CLIENT_SECRET}"
  fi
fi

if [ "${OAUTH2_STATUS}" = "skipped" ]; then
  echo "Automated OAuth2 rotation not available."
  if [ "${GCLOUD_AVAILABLE}" = false ]; then
    echo "  Reason: gcloud CLI not installed."
  elif [ -z "${GCLOUD_PROJECT_ID:-}" ] || [ -z "${GCLOUD_OAUTH_CLIENT_ID:-}" ]; then
    echo "  Reason: GCLOUD_PROJECT_ID and/or GCLOUD_OAUTH_CLIENT_ID not set."
  else
    echo "  Reason: gcloud credential creation failed (see above)."
  fi
  echo ""
  echo "Manual steps:"
  echo "  1. Go to https://console.cloud.google.com/apis/credentials"
  echo "  2. Click on your OAuth 2.0 client ID"
  echo "  3. Reset the client secret"
  echo ""
  read -rp "Enter new Google client ID (or press Enter to keep current): " NEW_CLIENT_ID
  if [ -n "${NEW_CLIENT_ID}" ]; then
    echo -n "${NEW_CLIENT_ID}" > "${SECRETS_DIR}/spring.security.oauth2.client.registration.google.client-id"
    echo "  Updated client ID."
    OAUTH2_STATUS="rotated (manual)"
  fi

  read -rp "Enter new Google client secret (or press Enter to keep current): " NEW_CLIENT_SECRET_MANUAL
  if [ -n "${NEW_CLIENT_SECRET_MANUAL}" ]; then
    echo -n "${NEW_CLIENT_SECRET_MANUAL}" > "${SECRETS_DIR}/spring.security.oauth2.client.registration.google.client-secret"
    echo "  Updated client secret."
    OAUTH2_STATUS="rotated (manual)"
  fi

  if [ "${OAUTH2_STATUS}" = "skipped" ]; then
    OAUTH2_STATUS="skipped (no values entered)"
  fi
fi

# --- Service restart and verification ---

echo ""
echo "=== Restarting services ==="

echo "Validating compose configuration..."
docker compose config --quiet

echo "Restarting services and waiting for health checks..."
docker compose up -d --wait

echo ""
echo "=== Rotation summary ==="
echo ""
echo "  Database password:    rotated"
echo "  Google OAuth2 secret: ${OAUTH2_STATUS}"
echo ""
echo "Verify service health with:"
echo "  docker compose ps"

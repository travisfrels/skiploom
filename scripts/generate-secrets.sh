#!/bin/bash
#
# Generate the secrets/ directory with all required secret files.
#
# - Local-only secrets (passwords) are randomly generated.
# - Google OAuth2 credentials are written as placeholders for manual replacement.
#
# Usage:
#   bash scripts/generate-secrets.sh
#
set -euo pipefail

SECRETS_DIR="secrets"

if [ -d "${SECRETS_DIR}" ]; then
  echo "WARNING: ${SECRETS_DIR}/ already exists."
  read -rp "Overwrite existing secrets? [y/N] " answer
  if [[ ! "${answer}" =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 0
  fi
fi

mkdir -p "${SECRETS_DIR}"

# --- Generate random local secrets ---

generate_password() {
  openssl rand -base64 24 | tr -d '/+='
}

POSTGRES_PASSWORD=$(generate_password)

echo -n "${POSTGRES_PASSWORD}" > "${SECRETS_DIR}/postgres_password"

# --- Copy postgres password to Spring datasource password ---

echo -n "${POSTGRES_PASSWORD}" > "${SECRETS_DIR}/spring.datasource.password"

# --- Write placeholder Google OAuth2 credentials ---

echo -n "REPLACE_WITH_GOOGLE_CLIENT_ID" > "${SECRETS_DIR}/spring.security.oauth2.client.registration.google.client-id"
echo -n "REPLACE_WITH_GOOGLE_CLIENT_SECRET" > "${SECRETS_DIR}/spring.security.oauth2.client.registration.google.client-secret"

# --- Summary ---

echo ""
echo "=== Secrets generated ==="
echo ""
echo "Generated random values:"
echo "  ${SECRETS_DIR}/postgres_password"
echo "  ${SECRETS_DIR}/spring.datasource.password (copied from postgres_password)"
echo ""
echo "ACTION REQUIRED — Replace these placeholders with real values:"
echo "  ${SECRETS_DIR}/spring.security.oauth2.client.registration.google.client-id"
echo "  ${SECRETS_DIR}/spring.security.oauth2.client.registration.google.client-secret"
echo ""
echo "Get Google OAuth2 credentials from: https://console.cloud.google.com/apis/credentials"

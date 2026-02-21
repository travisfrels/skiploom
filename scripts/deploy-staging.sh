#!/bin/bash
#
# Deploy and verify the Skiploom staging stack.
#
# Rebuilds Docker images from source, restarts staging services, and verifies
# all endpoints are healthy.
#
# Prerequisites:
#   - secrets/ directory with generated secret files
#   - Docker with Compose plugin
#   - curl
#
# Usage:
#   bash scripts/deploy-staging.sh
#
set -euo pipefail

SECRETS_DIR="secrets"
BACKEND_URL="http://localhost:8081/api/health"
FRONTEND_URL="http://localhost:5174"

# --- Precondition checks ---

if [ ! -d "${SECRETS_DIR}" ]; then
  echo "ERROR: ${SECRETS_DIR}/ does not exist. Run scripts/generate-secrets.sh first."
  exit 1
fi

if ! command -v docker &> /dev/null; then
  echo "ERROR: docker is required but not found."
  exit 1
fi

if ! command -v curl &> /dev/null; then
  echo "ERROR: curl is required but not found."
  exit 1
fi

echo "Validating compose configuration..."
docker compose config --quiet

# --- Deploy ---

echo ""
echo "=== Deploying staging stack ==="

echo "Rebuilding images and restarting services..."
docker compose --profile staging up -d --wait --build

# --- Verify ---

echo ""
echo "=== Verifying staging services ==="

BACKEND_STATUS="failed"
FRONTEND_STATUS="failed"

echo ""
echo "Container status:"
if ! docker compose --profile staging ps; then
  echo "  WARNING: Could not retrieve container status."
fi

echo ""
echo "Checking backend health endpoint..."
if curl -s "${BACKEND_URL}" | grep -q '"status":"UP"'; then
  BACKEND_STATUS="healthy"
  echo "  Backend is healthy."
else
  echo "  WARNING: Backend health check failed."
fi

echo ""
echo "Checking frontend is serving..."
if curl -sf -o /dev/null "${FRONTEND_URL}"; then
  FRONTEND_STATUS="healthy"
  echo "  Frontend is serving."
else
  echo "  WARNING: Frontend is not responding."
fi

# --- Summary ---

echo ""
echo "=== Deploy summary ==="
echo ""
echo "  Backend:  ${BACKEND_STATUS}"
echo "  Frontend: ${FRONTEND_STATUS}"

if [ "${BACKEND_STATUS}" != "healthy" ] || [ "${FRONTEND_STATUS}" != "healthy" ]; then
  echo ""
  echo "Deploy completed with verification failures. Check container logs:"
  echo "  docker compose --profile staging logs"
  exit 1
fi

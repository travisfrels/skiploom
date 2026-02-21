#!/bin/bash
#
# Run Playwright E2E tests against the development or staging environment.
#
# Validates preconditions, installs frontend dependencies and Playwright
# browsers, then executes the E2E test suite.
#
# Prerequisites:
#   - npm
#   - curl
#   - Target environment running with the e2e Spring profile
#
# Usage:
#   bash scripts/run-e2e.sh [--development|--staging]
#
#   --development  Run against local dev servers (localhost:5173/8080)
#   --staging      Run against Docker Compose staging stack (localhost:5174/8081)
#
#   Defaults to --staging when no flag is provided.
#
set -euo pipefail

FRONTEND_DIR="src/frontend"

usage() {
  echo "Usage: bash scripts/run-e2e.sh [--development|--staging]"
  echo ""
  echo "  --development  Run against local dev servers (localhost:5173/8080)"
  echo "  --staging      Run against Docker Compose staging stack (localhost:5174/8081)"
  echo ""
  echo "Defaults to --staging when no flag is provided."
}

# --- Parse arguments ---

ENV="staging"

if [ $# -gt 1 ]; then
  echo "ERROR: Expected at most one argument."
  echo ""
  usage
  exit 1
fi

if [ $# -eq 1 ]; then
  case "$1" in
    --development)
      ENV="development"
      ;;
    --staging)
      ENV="staging"
      ;;
    --help)
      usage
      exit 0
      ;;
    *)
      echo "ERROR: Unknown argument: $1"
      echo ""
      usage
      exit 1
      ;;
  esac
fi

# --- Set environment-specific URLs ---

if [ "${ENV}" = "development" ]; then
  FRONTEND_URL="http://localhost:5173"
  BACKEND_HEALTH_URL="http://localhost:8080/api/health"
  E2E_LOGIN_URL="http://localhost:5173/api/e2e/login"
else
  FRONTEND_URL="http://localhost:5174"
  BACKEND_HEALTH_URL="http://localhost:8081/api/health"
  E2E_LOGIN_URL="http://localhost:5174/api/e2e/login"
fi

echo "Environment: ${ENV}"
echo ""

# --- Precondition checks ---

if ! command -v npm &> /dev/null; then
  echo "ERROR: npm is required but not found."
  exit 1
fi

if ! command -v curl &> /dev/null; then
  echo "ERROR: curl is required but not found."
  exit 1
fi

echo "Checking backend health..."
if ! curl -s "${BACKEND_HEALTH_URL}" | grep -q '"status":"UP"'; then
  echo "ERROR: Backend is not healthy at ${BACKEND_HEALTH_URL}."
  if [ "${ENV}" = "development" ]; then
    echo "  Start the backend with the e2e profile:"
    echo "  ./gradlew bootRun --args='--spring.profiles.active=development,e2e'"
  else
    echo "  Start the staging stack first:"
    echo "  SPRING_PROFILES_ACTIVE=staging,e2e docker compose --profile staging up -d --wait --build"
  fi
  exit 1
fi

echo "Checking frontend is serving..."
if ! curl -sf -o /dev/null "${FRONTEND_URL}"; then
  echo "ERROR: Frontend is not responding at ${FRONTEND_URL}."
  if [ "${ENV}" = "development" ]; then
    echo "  Start the frontend dev server:"
    echo "  cd src/frontend && npm run dev"
  else
    echo "  Start the staging stack first:"
    echo "  SPRING_PROFILES_ACTIVE=staging,e2e docker compose --profile staging up -d --wait --build"
  fi
  exit 1
fi

echo "Checking E2E profile is active..."
if ! curl -sf -o /dev/null -X POST "${E2E_LOGIN_URL}"; then
  echo "ERROR: E2E login endpoint is not reachable at ${E2E_LOGIN_URL}."
  if [ "${ENV}" = "development" ]; then
    echo "  The backend must be running with the e2e Spring profile:"
    echo "  ./gradlew bootRun --args='--spring.profiles.active=development,e2e'"
  else
    echo "  The staging stack must be running with the e2e Spring profile:"
    echo "  SPRING_PROFILES_ACTIVE=staging,e2e docker compose --profile staging up -d --wait --build"
  fi
  exit 1
fi

# --- Install dependencies ---

echo ""
echo "=== Installing frontend dependencies ==="

cd "${FRONTEND_DIR}"

npm ci

# --- Install Playwright browsers ---

echo ""
echo "=== Installing Playwright browsers ==="

npx playwright install --with-deps chromium

# --- Run tests ---

echo ""
echo "=== Running E2E tests ==="

BASE_URL="${FRONTEND_URL}" npx playwright test

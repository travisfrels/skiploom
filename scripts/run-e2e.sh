#!/bin/bash
#
# Run Playwright E2E tests against the development or staging environment.
#
# Validates preconditions, installs frontend dependencies and Playwright
# browsers, then executes the E2E test suite.
#
# In development mode, the script auto-starts the backend and frontend dev
# servers if they are not already running, and stops them on exit.
#
# Prerequisites:
#   - npm
#   - curl
#   - --development: Java (for gradlew bootRun)
#   - --staging: Docker Compose staging stack running with the e2e Spring profile
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

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
FRONTEND_DIR="${REPO_ROOT}/src/frontend"
BACKEND_DIR="${REPO_ROOT}/src/backend"
BACKEND_LOG="${SCRIPT_DIR}/.backend.log"
FRONTEND_LOG="${SCRIPT_DIR}/.frontend.log"
HEALTH_POLL_INTERVAL=2
HEALTH_TIMEOUT=60

BACKEND_PID=""
FRONTEND_PID=""

usage() {
  echo "Usage: bash scripts/run-e2e.sh [--development|--staging]"
  echo ""
  echo "  --development  Run against local dev servers (localhost:5173/8080)"
  echo "  --staging      Run against Docker Compose staging stack (localhost:5174/8081)"
  echo ""
  echo "Defaults to --staging when no flag is provided."
}

cleanup() {
  if [ -n "${BACKEND_PID}" ]; then
    echo ""
    echo "Stopping backend (PID ${BACKEND_PID})..."
    kill "${BACKEND_PID}" 2>/dev/null || true
    wait "${BACKEND_PID}" 2>/dev/null || true
  fi
  if [ -n "${FRONTEND_PID}" ]; then
    echo "Stopping frontend (PID ${FRONTEND_PID})..."
    kill "${FRONTEND_PID}" 2>/dev/null || true
    wait "${FRONTEND_PID}" 2>/dev/null || true
  fi
}

wait_for_health() {
  local url="$1"
  local label="$2"
  local check_type="$3"
  local elapsed=0

  echo "Waiting for ${label} to become healthy..."
  while [ "${elapsed}" -lt "${HEALTH_TIMEOUT}" ]; do
    if [ "${check_type}" = "json" ]; then
      if curl -s "${url}" 2>/dev/null | grep -q '"status":"UP"'; then
        echo "  ${label} is healthy."
        return 0
      fi
    else
      if curl -sf -o /dev/null "${url}" 2>/dev/null; then
        echo "  ${label} is ready."
        return 0
      fi
    fi
    sleep "${HEALTH_POLL_INTERVAL}"
    elapsed=$((elapsed + HEALTH_POLL_INTERVAL))
  done

  echo "ERROR: ${label} did not become healthy within ${HEALTH_TIMEOUT}s."
  return 1
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

# --- Start or verify services ---

if [ "${ENV}" = "development" ]; then
  trap cleanup EXIT

  echo "Checking backend health..."
  if ! curl -s "${BACKEND_HEALTH_URL}" 2>/dev/null | grep -q '"status":"UP"'; then
    echo "  Backend is not running. Starting..."
    cd "${BACKEND_DIR}"
    ./gradlew bootRun --args='--spring.profiles.active=development,e2e' > "${BACKEND_LOG}" 2>&1 &
    BACKEND_PID=$!
    cd "${REPO_ROOT}"
    wait_for_health "${BACKEND_HEALTH_URL}" "Backend" "json"
  else
    echo "  Backend is already healthy."
  fi

  echo "Checking frontend is serving..."
  if ! curl -sf -o /dev/null "${FRONTEND_URL}" 2>/dev/null; then
    echo "  Frontend is not running. Starting..."
    cd "${FRONTEND_DIR}"
    npm run dev > "${FRONTEND_LOG}" 2>&1 &
    FRONTEND_PID=$!
    cd "${REPO_ROOT}"
    wait_for_health "${FRONTEND_URL}" "Frontend" "http"
  else
    echo "  Frontend is already serving."
  fi

  echo "Checking E2E profile is active..."
  if ! curl -sf -o /dev/null -X POST "${E2E_LOGIN_URL}"; then
    echo "ERROR: E2E login endpoint is not reachable at ${E2E_LOGIN_URL}."
    echo "  The backend must be running with the e2e Spring profile."
    exit 1
  fi
else
  echo "Checking backend health..."
  if ! curl -s "${BACKEND_HEALTH_URL}" | grep -q '"status":"UP"'; then
    echo "ERROR: Backend is not healthy at ${BACKEND_HEALTH_URL}."
    echo "  Start the staging stack first:"
    echo "  SPRING_PROFILES_ACTIVE=staging,e2e docker compose --profile staging up -d --wait --build"
    exit 1
  fi

  echo "Checking frontend is serving..."
  if ! curl -sf -o /dev/null "${FRONTEND_URL}"; then
    echo "ERROR: Frontend is not responding at ${FRONTEND_URL}."
    echo "  Start the staging stack first:"
    echo "  SPRING_PROFILES_ACTIVE=staging,e2e docker compose --profile staging up -d --wait --build"
    exit 1
  fi

  echo "Checking E2E profile is active..."
  if ! curl -sf -o /dev/null -X POST "${E2E_LOGIN_URL}"; then
    echo "ERROR: E2E login endpoint is not reachable at ${E2E_LOGIN_URL}."
    echo "  The staging stack must be running with the e2e Spring profile:"
    echo "  SPRING_PROFILES_ACTIVE=staging,e2e docker compose --profile staging up -d --wait --build"
    exit 1
  fi
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

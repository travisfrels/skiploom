#!/bin/bash
#
# Run Playwright E2E tests against the staging stack.
#
# Installs frontend dependencies and Playwright browsers, then executes the
# E2E test suite. The staging stack must already be running with the e2e
# Spring profile.
#
# Prerequisites:
#   - npm
#   - curl
#   - Docker Compose staging stack running with the e2e Spring profile
#
# Usage:
#   bash scripts/run-e2e.sh
#
set -euo pipefail

FRONTEND_DIR="src/frontend"
BACKEND_HEALTH_URL="http://localhost:8081/api/health"
FRONTEND_URL="http://localhost:5174"
E2E_LOGIN_URL="http://localhost:5174/api/e2e/login"
STACK_START_CMD="SPRING_PROFILES_ACTIVE=staging,e2e docker compose --profile staging up -d --wait --build"

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
  echo "  Start the staging stack first:"
  echo "  ${STACK_START_CMD}"
  exit 1
fi

echo "Checking frontend is serving..."
if ! curl -sf -o /dev/null "${FRONTEND_URL}"; then
  echo "ERROR: Frontend is not responding at ${FRONTEND_URL}."
  echo "  Start the staging stack first:"
  echo "  ${STACK_START_CMD}"
  exit 1
fi

echo "Checking E2E profile is active..."
if ! curl -sf -o /dev/null -X POST "${E2E_LOGIN_URL}"; then
  echo "ERROR: E2E login endpoint is not reachable at ${E2E_LOGIN_URL}."
  echo "  The staging stack must be running with the e2e Spring profile:"
  echo "  ${STACK_START_CMD}"
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

npx playwright test

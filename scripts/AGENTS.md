# Skiploom Scripts

Scripts for automation and tooling.

## Directory Structure

- `forgejo.sh`: Forgejo API wrapper functions (sources `.env` for configuration)
- `forgejo-swagger.json`: Swagger file for the Forgejo API

## Usage

Always use `forgejo.sh` wrapper functions for Forgejo API calls. Never use `curl` directly against the Forgejo API — the wrapper handles authentication and base URL construction.

If a needed API operation is not covered by an existing function, add a new function to `forgejo.sh` following the existing patterns rather than using raw `curl`.

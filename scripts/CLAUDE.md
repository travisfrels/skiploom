# Skiploom Scripts

Scripts for automation and tooling.

## Directory Structure

- `forgejo.sh`: Forgejo API wrapper functions.
- `forgejo-swagger.json`: SWAGGER file for the Forgejo API.
- `generate-secrets.json`: Generates skiploom secrets in the `../screts` directory.

## Usage

- Always use `forgejo.sh` wrapper functions for Forgejo API calls.
- Never use `curl`, `_forgejo_curl`, or `_forgejo_pr_agent_curl` directly against the Forgejo API because the wrapper handles authentication and base URL construction.
- If a needed API operation is not covered by existing functions, then add a new function to `forgejo.sh` by referencing `forgejo-swagger.json` and following the existing patterns.

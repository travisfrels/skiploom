# Skiploom

Digital recipe management system enabling a community to share and collaborate on recipes.

## Project Structure

```
skiploom/
├── src/                         # Source code
│   ├── frontend/                # React/TypeScript SPA
│   └── backend/                 # Kotlin/Spring REST API
├── docs/                        # Documentation
│   ├── adrs/                    # Architecture Decision Records
│   ├── projects/                # Project definitions
│   ├── ENG-DESIGN.md            # Engineering design
│   └── RUNBOOK.md               # Operational procedures
├── infra/                       # Infrastructure
│   └── postgres/                # PostgreSQL initialization
├── scripts/                     # Automation scripts
├── secrets.example/             # Secret file templates
├── compose.yml                  # Docker Compose
└── compose.e2e.yml              # Docker Compose E2E override
```

## Prerequisites

- [Node.js](https://nodejs.org/) 22+
- [Java](https://adoptium.net/) 21+
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Getting Started

1. Generate secrets:

   ```bash
   bash scripts/generate-secrets.sh
   ```

2. Replace the Google OAuth2 placeholder files in `secrets/` with real credentials from [Google Cloud Console](https://console.cloud.google.com/apis/credentials). See [`src/backend/README.md`](src/backend/README.md) for details.

3. Start all services:

   ```bash
   docker compose up -d
   ```

4. Open http://localhost:5173 in your browser.

For tier-specific setup and development instructions, see:

- [`src/frontend/README.md`](src/frontend/README.md)
- [`src/backend/README.md`](src/backend/README.md)

## Testing

- **Frontend unit tests**: See [`src/frontend/README.md`](src/frontend/README.md)
- **Backend unit tests**: See [`src/backend/README.md`](src/backend/README.md)
- **E2E tests**: `bash scripts/run-e2e.sh --development`

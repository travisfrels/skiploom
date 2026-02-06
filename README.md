# Skiploom

Recipe tracking system.

## Project Structure

```
skiploom/
├── src/                         # Source Code
│   ├── frontend/                # UX
│   │   ├── src/
│   │   │   ├── api/             # API Client
│   │   │   ├── components/      # UX Components
│   │   │   ├── operations/      # Orchestrate API Calls and State Mutation
│   │   │   ├── store/           # State Definition
│   │   │   ├── test/            # Test Configuration
│   │   │   └── types/           # Entity and DTO interfaces
│   │   └── package.json
│   └── backend/                 # API
│       ├── src/main/kotlin/com/skiploom/
│       │   ├── application/     # Commands, Queries, DTOs, validators, exceptions
│       │   ├── domain/          # Entities, Operation Interfaces
│       │   └── infrastructure/  # Controllers, Operation Implementations, Config
│       └── build.gradle.kts
├── docs/                        # Documentation
│   ├── adrs/                    # ADRs
│   ├── spades/                  # SPADEs
│   ├── eng-designs/             # Engineering Designs
│   └── CLAUDE.md
├── CLAUDE.md
└── README.md
```

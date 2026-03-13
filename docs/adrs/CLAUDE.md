# Skiploom Architecture Decision Records (ADR)

ADRs documenting significant technical decisions.

## Standards

- Created using the `/create-adr` skill.

## Eligibility Criteria

A decision warrants an ADR when it meets **any** of these conditions:

- Has system-wide architectural implications — shapes multiple projects or the entire system
- Represents incompatible alternatives that cannot be revisited without major refactoring
- Influences `docs/ENG-DESIGN.md` content
- Is referenced or expected to be referenced across multiple project files

A decision belongs in a **project Decisions table** (not an ADR) when:

- It is scoped to a single project or initiative
- It chooses *how* to implement something within existing architecture
- It influences only that project's components

## Index

| ADR | Title | Scope | Status |
|-----|-------|-------|--------|
| [ADR-OP-PERSISTENCE-20260205](ADR-OP-PERSISTENCE-20260205.md) | PostgreSQL for Operational Persistence | OP | Accepted |
| [ADR-DEV-DEVPLATFORM-20260206](ADR-DEV-DEVPLATFORM-20260206.md) | Forgejo as Local Development Hub | DEV | Superseded |
| [ADR-OP-SECRETS-20260215](ADR-OP-SECRETS-20260215.md) | Docker Compose File-Based Secrets for Local Development | OP | Accepted |
| [ADR-DEV-DEVPLATFORM-20260216](ADR-DEV-DEVPLATFORM-20260216.md) | GitHub as Development Platform | DEV | Accepted |
| [ADR-DEV-E2EAUTHBYPASS-20260218](ADR-DEV-E2EAUTHBYPASS-20260218.md) | Profile-Gated E2E Authentication Bypass | DEV | Accepted |
| [ADR-OP-FEATUREFLAGGING-20260220](ADR-OP-FEATUREFLAGGING-20260220.md) | Togglz for Feature Flagging with Release and Ops Toggles | OP | Accepted |
| [ADR-DEV-CLAUDEMD-20260313](ADR-DEV-CLAUDEMD-20260313.md) | Directive-First CLAUDE.md Authoring Convention | DEV | Accepted |
| [ADR-OP-ADMINUI-20260313](ADR-OP-ADMINUI-20260313.md) | Thymeleaf for Server-Rendered Admin UI | OP | Accepted |

# Skiploom Implementation Plan

## Purpose

This document defines the operating contract for building Skiploom.

## Participants & Authority

### Human Roles
- **Design**: user expectations, experience intent, interaction semantics
- **Engineering**: technical correctness, architecture, feasibility
- **Product**: scope, priorities, user value, release readiness

## Global Operating Rules

- Execute **one phase at a time**
- Do not advance phases without **explicit swarm confirmation**

## Documentation Rules (Event-Driven)

Documentation is produced only when justified by a decision.

- **ADR**: when rejecting a plausible alternative
- **SPADE**: when introducing a cross-phase or cross-layer constraint
- **ENG-DESIGN**: when a decision spans frontend and backend

No decision → no document.

## Feedback Rules

- External user feedback is expected only when explicitly stated
- Internal swarm review is always allowed


---


## Phase 0: Project Initialization (COMPLETE)

Establish the collaboration and execution structure.

### Scope

- Initialize source control. 
- Design the directory structure.
- Create the initial CLAUDE.md files within the directory structure.
- Define the initial use cases.

### Constraints

- No feature design
- No technology selection

### Decision Points

- None

### Human Checkpoint

- **Design**: approves the initial use case definitions.
- **Product**: approves the initial directory structure and use case definitions.
- **Engineering**: approves the initial directory structure and CLAUDE.md contents.

### Exit Criteria

[X] Source control initialized.
[X] Directory structure created.
[X] Initial CLAUDE.md files created.


---


## Phase 1: User Experience Design with User Feedback (COMPLETE)

### Purpose

Define what users expect to see and do, validate UX with real users, and establish confidence in the interaction model before deeper technical commitments.

### Scope

- Identify user-facing views, defining the intent of each view
- Design navigation and user flow
- Select and configure a design framework
- Compose UI components
- Write component tests
- Establish a provisional CI/CD pipeline to staging
- Deploy the UX to a **staging environment** for feedback
- Establish user feedback collection and analysis mechanism
- Collect and synthesize user feedback on UX flow

### Constraints

- DO NOT design application state
- DO NOT design backend APIs
- DO NOT assume data durability
- DO NOT assume production-level security, scale, or reliability
- Hard-code or mock data within components where needed

### Decision Points

- **UX Design Framework (Design)**: Choose a design framework for the UX
- **User Feedback Management (Product)**: Choose a workflow for collecting, analyzing, and communicating user feedback.
- **Staging Environment (Engineering)**: Choose a provisional staging environment in which to host the UX

### Human Checkpoint

- **Design**: approves UX intent, navigation, and interaction semantics
- **Product**: approves feedback collection and analysis design and communicates user satisfaction
- **Engineering**: approves the staging environment automated deployment mechanism

### Exit Criteria

[X] Component mock data created
[ ] UX is deployed to **staging**
[X] User feedback has been collected, analyzed, and synthesized
[X] Feedback is synthesized and categorized as:
    [X] accepted changes
    [X] rejected changes (with rationale)
    [X] deferred changes
[ ] Accepted changes have been implemented and deployed to **staging**

### Notes

- This phase intends to establish confidence in the user experience design, not the technical architecture
- Staging hosting decisions made here do **not** imply:
    - production hosting
    - backend architecture
    - persistence strategy
    - authentication provider
- Production hosting decisions are intentionally deferred.


---


## Phase 2: Application State Design (COMPLETE)

### Purpose
Define the minimal state required to support the UX.

### Scope
- Design state shape
- Design state mutation actions
- Integrate components with state
- Write state tests

### Constraints
- DO NOT design backend APIs
- Mock initial state where needed
- Remove hard-coded component data

### Decision Points
- State modeling approach (engineering-led)

### Human Checkpoint
- Engineering approves state model
- Design validates UX fidelity

### Exit Criteria

[X] State mock data created
[X] Components consume state interfaces only
[X] State requirements are explicit
[X] Component mock data removed


---


## Phase 3: API Client Design (COMPLETE)

### Purpose
Define how the frontend communicates with the backend.

### Scope
- Design API client interfaces
- Design operations that:
    - call APIs
    - mutate state
    - handle failure
- Write API client tests

### Constraints
- DO NOT implement backend APIs
- Mock API responses
- Remove mocked data from state

### Decision Points
- Client abstraction boundaries

### Human Checkpoint
- Engineering approves client design

### Exit Criteria

[X] API client mock data created
[X] State is fully driven by API client
[X] Success and failure paths modeled
[X] State mock data removed


---


## Phase 4: Backend API Design (COMPLETE)

### Purpose
Define the backend contract required by the client.

### Scope
- Define endpoints
- Define request/response shapes
- Define error envelopes
- Write API tests

### Constraints
- DO NOT implement domain logic
- DO NOT implement persistence
- Mock data where needed
- Remove mocks from API client

### Decision Points
- API style and error modeling approach

### Human Checkpoint
- Engineering approves API surface
- Product approves contract alignment

### Exit Criteria

[X] Controller mock data created
[X] API surface frozen
[X] Typed success and failure responses defined
[X] API client mock data removed


---


## Phase 5: Application / Domain Design (COMPLETE)

### Purpose

Define business logic independent of infrastructure.

### Scope
- Domain entities
- Use case interfaces (commands / queries)
- Validation rules
- Custom application exceptions
- Write use case tests

### Constraints
- DO NOT implement operations
- Use mock operations
- Remove mocked data from API

### Decision Points
- Domain modeling choices

### Human Checkpoint
- Engineering approves domain model
- Product approves business rules

### Exit Criteria

[X] Mock operations created
[X] Domain isolated from infrastructure
[X] API maps cleanly to use cases (command and queries)
[X] Controller mock data removed


---


## Phase 6: Operations Design (IN PROGRESS)

### Purpose

Decide upon infrastructure and SDKs to support operational requirements.

### Scope

- Establish operational categories (persistence, messaging, etc.)
- Create ADRs for each etablished operational categories
- Establish operational frameworks to support operational categories
- Implement infrastructure specific operations
- Seed operational infrastructure with data
- Write operation tests

### Constraints

- DO NOT optimize performance
- Remove mocks from application layer

### Decision Points

- Chosen operational category platforms and SDKs

### Human Checkpoint

- Engineering accepts operational ADRs

### Exit Criteria

[X] Operational Categories Established
[X] Operational Persistence ADR Accepted
[X] Operational Persistence infrastructure established
[ ] Operational Persistence frameworks established
[ ] System runs end-to-end locally


---


## Phase 7: System Integration & End-to-End Validation (TODO)

### Purpose
Validate the system as a system under realistic conditions.

### Scope
- Deploy full system to an integration environment
- Execute E2E scenarios:
    - critical user journeys
    - identity present/absent
    - failure modes
- Validate observability surfaces

### Constraints
- DO NOT assume production parity
- DO NOT lock infra abstractions

### Decision Points
- Minimal realism choices required for E2E testing

### Human Checkpoint
- Engineering and Product approve system behavior

### Exit Criteria
- E2E tests pass reliably
- System can be deployed and torn down deterministically


---


## Phase 8: Security — Authentication (TODO)

### Purpose
Introduce authenticated identity.

### Scope
- Select authentication provider
- Integrate auth UX
- Enforce authentication in UI and API
- Write authentication tests

### Constraints
- DO NOT implement authorization

### Decision Points
- Authentication provider selection (now required)

### Human Checkpoint
- Product approves auth flow
- Engineering approves integration

### Exit Criteria
- All access paths enforce authentication


---


## Phase 9: Security — Authorization (TODO)

### Purpose
Restrict actions based on identity.

### Scope
- Define authorization rules
- Enforce authorization in use cases and UI
- Write authorization tests

### Constraints
- Rules must be explicit and testable

### Decision Points
- Authorization model

### Human Checkpoint
- Product approves rules
- Engineering approves enforcement

### Exit Criteria
- All protected actions enforce authorization


---


## Phase 10: Production Readiness & Rollout (TODO)

### Purpose
Safely expose the system to real users.

### Scope
- Select final hosting environment
- Select final persistence strategy
- Finalize auth configuration
- Define rollout strategy (flags, canary, etc.)
- Monitoring, alerting, rollback
- Execute staged rollout

### Constraints
- DO NOT release without rollback
- DO NOT release without observability

### Decision Points
- Final infrastructure and release strategy

### Human Checkpoint
- Swarm approves production release

### Exit Criteria
- System live for intended audience
- Rollback is feasible and understood
- Post-release metrics reviewed

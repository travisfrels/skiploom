# Skiploom Source Code

Skiploom source code is split into directories by tier is stored within this directory.

## Directory Structure

- `backend/`: Backend API source code
- `frontend/`: Frontend UX source code

## High-Level Architecture

- **3-tier Application**: UX, API, and Persistence
    - **Frontend UX**: Browser-hosted SPA served from Container Hosted Web Server
    - **Backend API**: Container Hosted REST API
    - **Persistence**: Container Hosted RDBMS

## Development Standards

- **SOLID Principles**: Single responsibility, open-closed, Liskov substitution, interface segregation, and dependency inversion.
- **Don't Repeat Yourself (DRY)**: Avoid duplicating knowledge; define each concept once.
- See `backend/CLAUDE.md` for backend development standards.
- See `frontend/CLAUDE.md` for frontend development standards.

## Testing

- See `backend/CLAUDE.md` for backend testing instructions.
- See `frontend/CLAUDE.md` for frontend testing instructions.

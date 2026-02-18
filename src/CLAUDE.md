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

## Testing

- See `backend/CLAUDE.md` for backend testing instructions.
- See `frontend/CLAUDE.md` for frontend testing instructions.

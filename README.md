# ECHO

Comprehensive platform for the digital and physical art sector. Connects supply and demand in a three-way marketplace. 

Solves the fragmentation of the cultural market. Centralizes visibility, contracting, and event management.

## Architecture

Frontend: React.

Backend: Spring Boot (Java).

Database: MariaDB.

## Docker Deployment 

The project is now ready to run with Docker Compose using three images:

- Backend image from [backend/docker/Dockerfile](backend/docker/Dockerfile)
- Frontend image from [frontend/docker/Dockerfile](frontend/docker/Dockerfile)
- Persistence image from [persistence/docker/Dockerfile](persistence/docker/Dockerfile)

Main orchestration file:

- [docker-compose.yml](docker-compose.yml)

### 1) Prepare environment

1. Copy [.env.example](.env.example) to `.env`.
2. Fill real values, especially:
  - `MYSQL_ROOT_PASSWORD`
  - `MYSQL_PASSWORD`
  - `ECHO_JWT_SECRET` (at least 32 chars)
  - `CORS_ALLOWED_ORIGIN` (frontend public URL)

### 2) Start application

Run from repository root:

```bash
docker compose up -d --build
```

Frontend will be available on `http://localhost:${FRONTEND_PORT}` (default 8080).

### 3) Create or promote an admin securely (no backend endpoint)

A one-shot service is available for admin bootstrap (`admin-init`) and only runs when profile `tools` is requested.

Recommended secure approach:

1. Set `APP_ADMIN_EMAIL` and `APP_ADMIN_PASSWORD_HASH` in `.env`.
2. Execute:

```bash
docker compose --profile tools run --rm admin-init
```

This process:

- Creates the admin user if it does not exist.
- Or promotes an existing user to role `ADMIN`.
- Does not expose any HTTP endpoint for admin creation.

### 4) Stop services

```bash
docker compose down
```

To also remove DB volume:

```bash
docker compose down -v
```

## System Actors

**Content Creator**
Artists and creative professionals. Upload portfolios, manage deliverables, and apply to physical events.

**Service Requester**
Individuals or companies. Search for talent, buy products, or commission custom artwork.

**Venue Manager**
Owners of venues and galleries. Seek artistic content for their events and manage contracts.


![logo](https://github.com/user-attachments/assets/5b0f5adb-ff35-419a-8219-b2f6bb5b86b8)
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 245.25 152.89">
  <defs>
    

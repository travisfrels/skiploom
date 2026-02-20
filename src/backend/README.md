# Skiploom Backend

REST API written in Kotlin using the Spring framework implementing CQRS and Clean Architecture patterns.

## Directory Structure

TODO: Add folder structure ASCII art.

## Configuration

### Google OAuth2

The backend uses Google OAuth2 for authentication. The development profile has credentials preconfigured; staging and production profiles require environment variables.

#### Required Environment Variables

| Variable | Description |
|----------|-------------|
| `GOOGLE_CLIENT_ID` | Google OAuth2 client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth2 client secret |

See [`.env.example`](../../.env.example) at the repository root for a template.

#### Creating a Google Cloud OAuth2 Client

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Navigate to **APIs & Services > Credentials**.
3. Click **Create Credentials > OAuth client ID**.
4. Select **Web application** as the application type.
5. Enter a **Name** for the client (e.g. "Skiploom"). This is only used for identification in the console.
6. Under **Authorized JavaScript origins**, add:
   - `http://localhost:8080` (backend)
   - `http://localhost:5173` (frontend dev via Vite)
   - `http://localhost:5174` (frontend staging via Docker)
7. Under **Authorized redirect URIs**, add:
   - `http://localhost:8080/login/oauth2/code/google` (development)
   - `http://localhost:5174/login/oauth2/code/google` (staging via Docker)
8. Copy the generated **Client ID** and **Client Secret** into your `.env` file.

#### Startup Validation

The backend validates that `client-id` and `client-secret` are non-blank at startup. If either is missing or empty, the application fails fast with an error message naming the missing variable.

## Getting Started

### Prerequisites

- JDK 17+ (tested with JDK 24)

### Running the Backend

```bash
# PowerShell or CMD
.\gradlew.bat bootRun

# Bash
./gradlew bootRun
```

The API will be available at http://localhost:8080.

**NOTES**:
- Ensure the `JAVA_HOME` environment variable is set properly.
- Ensure the Java `bin` directory is in the `PATH` environment variable.

### Running Tests

```bash
# PowerShell or CMD
.\gradlew.bat test

# Bash
./gradlew test
```

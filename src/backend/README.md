# Skiploom Backend

REST API written in Kotlin using the Spring framework implementing CQRS and Clean Architecture patterns.

## Directory Structure

```
src/backend/
├── src/
│   ├── main/
│   │   ├── kotlin/com/skiploom/  # Application source code
│   │   │   ├── application/      # Use cases and services
│   │   │   ├── domain/           # Entities and business logic
│   │   │   └── infrastructure/   # Adapters and external integrations
│   │   └── resources/            # Configuration files
│   │       └── db/               # Flyway database migrations
│   └── test/                     # Test source and resources
├── gradle/                       # Gradle wrapper
├── build.gradle.kts              # Build configuration
├── Dockerfile                    # Container build definition
├── gradlew / gradlew.bat         # Gradle wrapper scripts
└── settings.gradle.kts           # Gradle settings
```

## Configuration

### Google OAuth2

The backend uses Google OAuth2 for authentication. All profiles read credentials from Docker Compose file-based secrets via Spring Boot configtree. Run [`scripts/generate-secrets.sh`](../../scripts/generate-secrets.sh) to create the required secret files.

#### Required Secrets

| Secret File | Description |
|-------------|-------------|
| `spring.security.oauth2.client.registration.google.client-id` | Google OAuth2 client ID |
| `spring.security.oauth2.client.registration.google.client-secret` | Google OAuth2 client secret |

See [`scripts/generate-secrets.sh`](../../scripts/generate-secrets.sh) for setup.

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
8. Copy the generated **Client ID** and **Client Secret** into the corresponding secret files in the `secrets/` directory (see [setup script](../../scripts/generate-secrets.sh)).

#### Startup Validation

The backend validates that `client-id` and `client-secret` are non-blank at startup. If either is missing or empty, the application fails fast with an error message naming the missing variable.

## Getting Started

### Prerequisites

- JDK 21+

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

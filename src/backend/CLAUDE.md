# Skiploom Backend

REST API written in Kotlin using the Spring framework.

## Directory Structure

- `gradle/wrapper/`: Gradle wrapper files.
- `src/main/kotlin/com/skiploom/`: Application source. See `src/main/kotlin/com/skiploom/CLAUDE.md` for Clean Architecture layers, CQRS conventions, and coding standards.
- `src/main/resources/`: Application configuration (Spring profiles, Flyway migrations, static resources).
- `src/test/kotlin/com/skiploom/`: Application tests. See `src/test/kotlin/com/skiploom/CLAUDE.md` for testing conventions and mock patterns.

## Development Standards

- **Clean Architecture Pattern**: Code is organized in concentric layers where dependencies always point inward.
- **Command Query Responsibility Segregation (CQRS) as REST**: Commands mutate state via POST, queries fetch data via GET.

## Testing

```bash
./gradlew test
```

## Run

```bash
./gradlew bootRun
```

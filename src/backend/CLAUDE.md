# Skiploom Backend

REST API written in Kotlin using the Spring framework.

## Directory Structure

- `gradle/wrapper/`: Gradle wrapper files.
- `src/main/kotlin/com/skiploom`: The skiploom application source files.
- `src/main/resources/`: The skiploom application configuration files.
- `src/test/kotlin/com/skip/`: The skiploom application test files.

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

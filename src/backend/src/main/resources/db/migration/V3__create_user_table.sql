CREATE TABLE "user" (
    id              UUID PRIMARY KEY,
    google_subject  VARCHAR(255) NOT NULL UNIQUE,
    email           VARCHAR(255) NOT NULL,
    display_name    VARCHAR(255) NOT NULL
);

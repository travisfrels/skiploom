CREATE TABLE idempotency_claim (
    idempotency_key UUID PRIMARY KEY,
    recipe_id       UUID,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

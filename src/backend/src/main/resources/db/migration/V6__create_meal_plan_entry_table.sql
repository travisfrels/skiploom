CREATE TABLE meal_plan_entry (
    id        UUID PRIMARY KEY,
    user_id   UUID NOT NULL REFERENCES "user"(id),
    date      DATE NOT NULL,
    meal_type VARCHAR(10) NOT NULL,
    recipe_id UUID REFERENCES recipe(id) ON DELETE SET NULL,
    title     VARCHAR(100) NOT NULL,
    notes     VARCHAR(500)
);

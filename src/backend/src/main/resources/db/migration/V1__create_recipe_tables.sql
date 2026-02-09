CREATE TABLE recipe (
    id          UUID PRIMARY KEY,
    title       VARCHAR(100) NOT NULL,
    description VARCHAR(5000)
);

CREATE TABLE ingredient (
    recipe_id   UUID NOT NULL REFERENCES recipe(id) ON DELETE CASCADE,
    order_index INT NOT NULL,
    amount      DOUBLE PRECISION NOT NULL,
    unit        VARCHAR(25) NOT NULL,
    name        VARCHAR(100) NOT NULL,
    PRIMARY KEY (recipe_id, order_index)
);

CREATE TABLE step (
    recipe_id   UUID NOT NULL REFERENCES recipe(id) ON DELETE CASCADE,
    order_index INT NOT NULL,
    instruction VARCHAR(5000) NOT NULL,
    PRIMARY KEY (recipe_id, order_index)
);

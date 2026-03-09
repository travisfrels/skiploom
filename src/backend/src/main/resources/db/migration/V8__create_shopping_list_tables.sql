CREATE TABLE shopping_list (
    id      UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES "user"(id),
    title   VARCHAR(100) NOT NULL
);

CREATE TABLE shopping_list_item (
    id               UUID PRIMARY KEY,
    shopping_list_id UUID NOT NULL REFERENCES shopping_list(id) ON DELETE CASCADE,
    label            VARCHAR(200) NOT NULL,
    checked          BOOLEAN NOT NULL DEFAULT FALSE,
    order_index      INT NOT NULL
);

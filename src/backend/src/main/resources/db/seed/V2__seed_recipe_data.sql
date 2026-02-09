INSERT INTO recipe (id, title, description) VALUES
    ('b1e4a4e0-1c2d-4f3a-8b5c-6d7e8f9a0b1c', 'Chocolate Chip Cookies', 'Classic homemade chocolate chip cookies with a soft, chewy center and crispy edges.'),
    ('a2f5b3d1-2d3e-4a5b-9c6d-7e8f0a1b2c3d', 'Scrambled Eggs', NULL);

INSERT INTO ingredient (recipe_id, order_index, amount, unit, name) VALUES
    ('b1e4a4e0-1c2d-4f3a-8b5c-6d7e8f9a0b1c', 1, 2.25, 'cups', 'all-purpose flour'),
    ('b1e4a4e0-1c2d-4f3a-8b5c-6d7e8f9a0b1c', 2, 1.0, 'tsp', 'baking soda'),
    ('b1e4a4e0-1c2d-4f3a-8b5c-6d7e8f9a0b1c', 3, 1.0, 'tsp', 'salt'),
    ('b1e4a4e0-1c2d-4f3a-8b5c-6d7e8f9a0b1c', 4, 1.0, 'cup', 'butter'),
    ('b1e4a4e0-1c2d-4f3a-8b5c-6d7e8f9a0b1c', 5, 0.75, 'cup', 'granulated sugar'),
    ('b1e4a4e0-1c2d-4f3a-8b5c-6d7e8f9a0b1c', 6, 0.75, 'cup', 'packed brown sugar'),
    ('b1e4a4e0-1c2d-4f3a-8b5c-6d7e8f9a0b1c', 7, 2.0, 'large', 'eggs'),
    ('b1e4a4e0-1c2d-4f3a-8b5c-6d7e8f9a0b1c', 8, 1.0, 'tsp', 'vanilla extract'),
    ('b1e4a4e0-1c2d-4f3a-8b5c-6d7e8f9a0b1c', 9, 2.0, 'cups', 'chocolate chips'),
    ('a2f5b3d1-2d3e-4a5b-9c6d-7e8f0a1b2c3d', 1, 4.0, 'large', 'eggs'),
    ('a2f5b3d1-2d3e-4a5b-9c6d-7e8f0a1b2c3d', 2, 2.0, 'tbsp', 'butter'),
    ('a2f5b3d1-2d3e-4a5b-9c6d-7e8f0a1b2c3d', 3, 2.0, 'tbsp', 'milk'),
    ('a2f5b3d1-2d3e-4a5b-9c6d-7e8f0a1b2c3d', 4, 0.25, 'tsp', 'salt');

INSERT INTO step (recipe_id, order_index, instruction) VALUES
    ('b1e4a4e0-1c2d-4f3a-8b5c-6d7e8f9a0b1c', 1, 'Preheat oven to 375 degrees F (190 degrees C).'),
    ('b1e4a4e0-1c2d-4f3a-8b5c-6d7e8f9a0b1c', 2, 'Whisk together flour, baking soda, and salt in a bowl and set aside.'),
    ('b1e4a4e0-1c2d-4f3a-8b5c-6d7e8f9a0b1c', 3, 'Beat butter, granulated sugar, and brown sugar with an electric mixer until creamy.'),
    ('b1e4a4e0-1c2d-4f3a-8b5c-6d7e8f9a0b1c', 4, 'Add eggs and vanilla to butter mixture and beat well.'),
    ('b1e4a4e0-1c2d-4f3a-8b5c-6d7e8f9a0b1c', 5, 'Gradually stir in the flour mixture until just combined.'),
    ('b1e4a4e0-1c2d-4f3a-8b5c-6d7e8f9a0b1c', 6, 'Fold in chocolate chips.'),
    ('b1e4a4e0-1c2d-4f3a-8b5c-6d7e8f9a0b1c', 7, 'Drop rounded tablespoons of dough onto ungreased baking sheets.'),
    ('b1e4a4e0-1c2d-4f3a-8b5c-6d7e8f9a0b1c', 8, 'Bake for 9 to 11 minutes or until golden brown. Cool on baking sheets for 2 minutes, then transfer to wire racks.'),
    ('a2f5b3d1-2d3e-4a5b-9c6d-7e8f0a1b2c3d', 1, 'Crack eggs into a bowl. Add milk and salt, then beat until well combined.'),
    ('a2f5b3d1-2d3e-4a5b-9c6d-7e8f0a1b2c3d', 2, 'Melt butter in a non-stick skillet over medium-low heat.'),
    ('a2f5b3d1-2d3e-4a5b-9c6d-7e8f0a1b2c3d', 3, 'Pour in the egg mixture. Let it sit until the edges begin to set, then gently push the eggs from the edges toward the center with a spatula.'),
    ('a2f5b3d1-2d3e-4a5b-9c6d-7e8f0a1b2c3d', 4, 'Continue folding until the eggs are softly set but still slightly moist. Remove from heat and serve immediately.');

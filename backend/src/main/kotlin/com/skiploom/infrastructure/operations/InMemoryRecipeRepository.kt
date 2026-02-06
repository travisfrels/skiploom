package com.skiploom.infrastructure.operations

import com.skiploom.domain.entities.Ingredient
import com.skiploom.domain.entities.Recipe
import com.skiploom.domain.entities.Step
import com.skiploom.domain.operations.RecipeReader
import com.skiploom.domain.operations.RecipeWriter
import org.springframework.stereotype.Repository
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap

@Repository
class InMemoryRecipeRepository : RecipeReader, RecipeWriter {

    private val recipes = ConcurrentHashMap<UUID, Recipe>()

    init {
        seedData()
    }

    override fun fetchAll(): List<Recipe> {
        return recipes.values.toList()
    }

    override fun exists(id: UUID): Boolean {
        return recipes.containsKey(id)
    }

    override fun fetchById(id: UUID): Recipe? {
        return recipes[id]
    }

    override fun save(recipe: Recipe): Recipe {
        recipes[recipe.id] = recipe
        return recipe
    }

    override fun delete(id: UUID): Boolean {
        return recipes.remove(id) != null
    }

    private fun seedData() {
        val recipe1Id = UUID.fromString("00000000-0000-0000-0000-000000000001")
        val recipe2Id = UUID.fromString("00000000-0000-0000-0000-000000000002")
        val recipe3Id = UUID.fromString("00000000-0000-0000-0000-000000000003")
        val recipe4Id = UUID.fromString("00000000-0000-0000-0000-000000000004")

        recipes[recipe1Id] = Recipe(
            id = recipe1Id,
            title = "Grandma's Chocolate Chip Cookies",
            description = "The classic family recipe passed down for generations. Crispy on the outside, chewy on the inside.",
            ingredients = listOf(
                Ingredient(1, 2.25, "cups", "all-purpose flour"),
                Ingredient(2, 1.0, "tsp", "baking soda"),
                Ingredient(3, 1.0, "tsp", "salt"),
                Ingredient(4, 1.0, "cup", "butter, softened"),
                Ingredient(5, 0.75, "cup", "granulated sugar"),
                Ingredient(6, 0.75, "cup", "brown sugar, packed"),
                Ingredient(7, 2.0, "large", "eggs"),
                Ingredient(8, 1.0, "tsp", "vanilla extract"),
                Ingredient(9, 2.0, "cups", "chocolate chips")
            ),
            steps = listOf(
                Step(1, "Preheat oven to 375°F (190°C)."),
                Step(2, "Combine flour, baking soda, and salt in a small bowl."),
                Step(3, "Beat butter, granulated sugar, and brown sugar in a large mixer bowl until creamy."),
                Step(4, "Add eggs and vanilla extract; beat well."),
                Step(5, "Gradually beat in flour mixture. Stir in chocolate chips."),
                Step(6, "Drop rounded tablespoons of dough onto ungreased baking sheets."),
                Step(7, "Bake for 9 to 11 minutes or until golden brown. Cool on baking sheets for 2 minutes.")
            )
        )

        recipes[recipe2Id] = Recipe(
            id = recipe2Id,
            title = "Mom's Chicken Noodle Soup",
            description = "The perfect comfort food for cold days or when you're feeling under the weather.",
            ingredients = listOf(
                Ingredient(1, 1.0, "whole", "chicken (about 4 lbs)"),
                Ingredient(2, 10.0, "cups", "water"),
                Ingredient(3, 3.0, "stalks", "celery, chopped"),
                Ingredient(4, 3.0, "medium", "carrots, sliced"),
                Ingredient(5, 1.0, "large", "onion, diced"),
                Ingredient(6, 2.0, "cloves", "garlic, minced"),
                Ingredient(7, 8.0, "oz", "egg noodles"),
                Ingredient(8, 2.0, "tsp", "salt"),
                Ingredient(9, 0.5, "tsp", "black pepper"),
                Ingredient(10, 2.0, "tbsp", "fresh parsley, chopped")
            ),
            steps = listOf(
                Step(1, "Place chicken in a large pot and cover with water. Bring to a boil."),
                Step(2, "Reduce heat and simmer for 1 hour until chicken is cooked through."),
                Step(3, "Remove chicken and let cool. Strain broth and return to pot."),
                Step(4, "Add celery, carrots, onion, and garlic to broth. Simmer for 15 minutes."),
                Step(5, "Shred chicken meat and add back to pot. Discard bones and skin."),
                Step(6, "Add egg noodles and cook for 8-10 minutes until tender."),
                Step(7, "Season with salt, pepper, and parsley. Serve hot.")
            )
        )

        recipes[recipe3Id] = Recipe(
            id = recipe3Id,
            title = "Dad's Famous Pancakes",
            description = "Fluffy weekend pancakes that the whole family loves.",
            ingredients = listOf(
                Ingredient(1, 1.5, "cups", "all-purpose flour"),
                Ingredient(2, 3.5, "tsp", "baking powder"),
                Ingredient(3, 1.0, "tbsp", "sugar"),
                Ingredient(4, 0.25, "tsp", "salt"),
                Ingredient(5, 1.25, "cups", "milk"),
                Ingredient(6, 1.0, "large", "egg"),
                Ingredient(7, 3.0, "tbsp", "butter, melted")
            ),
            steps = listOf(
                Step(1, "Mix flour, baking powder, sugar, and salt in a large bowl."),
                Step(2, "Make a well in the center and pour in milk, egg, and melted butter."),
                Step(3, "Mix until smooth but don't overmix - some lumps are okay."),
                Step(4, "Heat a griddle over medium-high heat and lightly grease."),
                Step(5, "Pour 1/4 cup batter for each pancake. Cook until bubbles form on surface."),
                Step(6, "Flip and cook until golden brown on both sides. Serve with maple syrup.")
            )
        )

        recipes[recipe4Id] = Recipe(
            id = recipe4Id,
            title = "Aunt Sara's Apple Pie",
            description = "A traditional apple pie with a flaky crust and warm spices.",
            ingredients = listOf(
                Ingredient(1, 2.0, "cups", "all-purpose flour"),
                Ingredient(2, 1.0, "tsp", "salt"),
                Ingredient(3, 0.75, "cup", "cold butter, cubed"),
                Ingredient(4, 6.0, "tbsp", "ice water"),
                Ingredient(5, 6.0, "medium", "apples, peeled and sliced"),
                Ingredient(6, 0.75, "cup", "sugar"),
                Ingredient(7, 2.0, "tbsp", "flour"),
                Ingredient(8, 1.0, "tsp", "cinnamon"),
                Ingredient(9, 0.25, "tsp", "nutmeg")
            ),
            steps = listOf(
                Step(1, "Mix 2 cups flour and salt. Cut in butter until crumbly."),
                Step(2, "Add ice water gradually until dough forms. Divide in half and chill."),
                Step(3, "Preheat oven to 425°F (220°C)."),
                Step(4, "Toss apples with sugar, 2 tbsp flour, cinnamon, and nutmeg."),
                Step(5, "Roll out one dough half and place in 9-inch pie plate."),
                Step(6, "Fill with apple mixture. Roll out second dough and place on top. Crimp edges."),
                Step(7, "Cut slits in top crust. Bake 45-50 minutes until golden.")
            )
        )
    }
}

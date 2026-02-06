package com.skiploom.infrastructure.persistence

import com.skiploom.domain.Ingredient
import com.skiploom.domain.Recipe
import com.skiploom.domain.RecipeRepository
import com.skiploom.domain.Step
import org.springframework.stereotype.Repository
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap

@Repository
class InMemoryRecipeRepository : RecipeRepository {

    private val recipes = ConcurrentHashMap<UUID, Recipe>()

    init {
        seedData()
    }

    override fun findAll(): List<Recipe> {
        return recipes.values.toList()
    }

    override fun findById(id: UUID): Recipe? {
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
                Ingredient(UUID.randomUUID(), 2.25, "cups", "all-purpose flour"),
                Ingredient(UUID.randomUUID(), 1.0, "tsp", "baking soda"),
                Ingredient(UUID.randomUUID(), 1.0, "tsp", "salt"),
                Ingredient(UUID.randomUUID(), 1.0, "cup", "butter, softened"),
                Ingredient(UUID.randomUUID(), 0.75, "cup", "granulated sugar"),
                Ingredient(UUID.randomUUID(), 0.75, "cup", "brown sugar, packed"),
                Ingredient(UUID.randomUUID(), 2.0, "large", "eggs"),
                Ingredient(UUID.randomUUID(), 1.0, "tsp", "vanilla extract"),
                Ingredient(UUID.randomUUID(), 2.0, "cups", "chocolate chips")
            ),
            steps = listOf(
                Step(UUID.randomUUID(), 1, "Preheat oven to 375°F (190°C)."),
                Step(UUID.randomUUID(), 2, "Combine flour, baking soda, and salt in a small bowl."),
                Step(UUID.randomUUID(), 3, "Beat butter, granulated sugar, and brown sugar in a large mixer bowl until creamy."),
                Step(UUID.randomUUID(), 4, "Add eggs and vanilla extract; beat well."),
                Step(UUID.randomUUID(), 5, "Gradually beat in flour mixture. Stir in chocolate chips."),
                Step(UUID.randomUUID(), 6, "Drop rounded tablespoons of dough onto ungreased baking sheets."),
                Step(UUID.randomUUID(), 7, "Bake for 9 to 11 minutes or until golden brown. Cool on baking sheets for 2 minutes.")
            )
        )

        recipes[recipe2Id] = Recipe(
            id = recipe2Id,
            title = "Mom's Chicken Noodle Soup",
            description = "The perfect comfort food for cold days or when you're feeling under the weather.",
            ingredients = listOf(
                Ingredient(UUID.randomUUID(), 1.0, "whole", "chicken (about 4 lbs)"),
                Ingredient(UUID.randomUUID(), 10.0, "cups", "water"),
                Ingredient(UUID.randomUUID(), 3.0, "stalks", "celery, chopped"),
                Ingredient(UUID.randomUUID(), 3.0, "medium", "carrots, sliced"),
                Ingredient(UUID.randomUUID(), 1.0, "large", "onion, diced"),
                Ingredient(UUID.randomUUID(), 2.0, "cloves", "garlic, minced"),
                Ingredient(UUID.randomUUID(), 8.0, "oz", "egg noodles"),
                Ingredient(UUID.randomUUID(), 2.0, "tsp", "salt"),
                Ingredient(UUID.randomUUID(), 0.5, "tsp", "black pepper"),
                Ingredient(UUID.randomUUID(), 2.0, "tbsp", "fresh parsley, chopped")
            ),
            steps = listOf(
                Step(UUID.randomUUID(), 1, "Place chicken in a large pot and cover with water. Bring to a boil."),
                Step(UUID.randomUUID(), 2, "Reduce heat and simmer for 1 hour until chicken is cooked through."),
                Step(UUID.randomUUID(), 3, "Remove chicken and let cool. Strain broth and return to pot."),
                Step(UUID.randomUUID(), 4, "Add celery, carrots, onion, and garlic to broth. Simmer for 15 minutes."),
                Step(UUID.randomUUID(), 5, "Shred chicken meat and add back to pot. Discard bones and skin."),
                Step(UUID.randomUUID(), 6, "Add egg noodles and cook for 8-10 minutes until tender."),
                Step(UUID.randomUUID(), 7, "Season with salt, pepper, and parsley. Serve hot.")
            )
        )

        recipes[recipe3Id] = Recipe(
            id = recipe3Id,
            title = "Dad's Famous Pancakes",
            description = "Fluffy weekend pancakes that the whole family loves.",
            ingredients = listOf(
                Ingredient(UUID.randomUUID(), 1.5, "cups", "all-purpose flour"),
                Ingredient(UUID.randomUUID(), 3.5, "tsp", "baking powder"),
                Ingredient(UUID.randomUUID(), 1.0, "tbsp", "sugar"),
                Ingredient(UUID.randomUUID(), 0.25, "tsp", "salt"),
                Ingredient(UUID.randomUUID(), 1.25, "cups", "milk"),
                Ingredient(UUID.randomUUID(), 1.0, "large", "egg"),
                Ingredient(UUID.randomUUID(), 3.0, "tbsp", "butter, melted")
            ),
            steps = listOf(
                Step(UUID.randomUUID(), 1, "Mix flour, baking powder, sugar, and salt in a large bowl."),
                Step(UUID.randomUUID(), 2, "Make a well in the center and pour in milk, egg, and melted butter."),
                Step(UUID.randomUUID(), 3, "Mix until smooth but don't overmix - some lumps are okay."),
                Step(UUID.randomUUID(), 4, "Heat a griddle over medium-high heat and lightly grease."),
                Step(UUID.randomUUID(), 5, "Pour 1/4 cup batter for each pancake. Cook until bubbles form on surface."),
                Step(UUID.randomUUID(), 6, "Flip and cook until golden brown on both sides. Serve with maple syrup.")
            )
        )

        recipes[recipe4Id] = Recipe(
            id = recipe4Id,
            title = "Aunt Sara's Apple Pie",
            description = "A traditional apple pie with a flaky crust and warm spices.",
            ingredients = listOf(
                Ingredient(UUID.randomUUID(), 2.0, "cups", "all-purpose flour"),
                Ingredient(UUID.randomUUID(), 1.0, "tsp", "salt"),
                Ingredient(UUID.randomUUID(), 0.75, "cup", "cold butter, cubed"),
                Ingredient(UUID.randomUUID(), 6.0, "tbsp", "ice water"),
                Ingredient(UUID.randomUUID(), 6.0, "medium", "apples, peeled and sliced"),
                Ingredient(UUID.randomUUID(), 0.75, "cup", "sugar"),
                Ingredient(UUID.randomUUID(), 2.0, "tbsp", "flour"),
                Ingredient(UUID.randomUUID(), 1.0, "tsp", "cinnamon"),
                Ingredient(UUID.randomUUID(), 0.25, "tsp", "nutmeg")
            ),
            steps = listOf(
                Step(UUID.randomUUID(), 1, "Mix 2 cups flour and salt. Cut in butter until crumbly."),
                Step(UUID.randomUUID(), 2, "Add ice water gradually until dough forms. Divide in half and chill."),
                Step(UUID.randomUUID(), 3, "Preheat oven to 425°F (220°C)."),
                Step(UUID.randomUUID(), 4, "Toss apples with sugar, 2 tbsp flour, cinnamon, and nutmeg."),
                Step(UUID.randomUUID(), 5, "Roll out one dough half and place in 9-inch pie plate."),
                Step(UUID.randomUUID(), 6, "Fill with apple mixture. Roll out second dough and place on top. Crimp edges."),
                Step(UUID.randomUUID(), 7, "Cut slits in top crust. Bake 45-50 minutes until golden.")
            )
        )
    }
}

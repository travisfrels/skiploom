package com.skiploom.infrastructure.web

import com.skiploom.application.RecipeDto
import com.skiploom.application.RecipeNotFoundException
import com.skiploom.application.RecipeSummaryDto
import com.skiploom.application.query.GetAllRecipes
import com.skiploom.application.query.GetRecipeById
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/recipes")
class RecipeQueryController(
    private val getAllRecipes: GetAllRecipes,
    private val getRecipeById: GetRecipeById
) {

    @GetMapping
    fun getAllRecipes(): ResponseEntity<List<RecipeSummaryDto>> {
        val recipes = getAllRecipes.execute()
        return ResponseEntity.ok(recipes)
    }

    @GetMapping("/{id}")
    fun getRecipeById(@PathVariable id: String): ResponseEntity<RecipeDto> {
        val uuid = try {
            UUID.fromString(id)
        } catch (e: IllegalArgumentException) {
            throw RecipeNotFoundException(id)
        }

        val recipe = getRecipeById.execute(uuid)
            ?: throw RecipeNotFoundException(id)

        return ResponseEntity.ok(recipe)
    }
}

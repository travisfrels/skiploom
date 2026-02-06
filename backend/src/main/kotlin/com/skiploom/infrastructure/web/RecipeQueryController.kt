package com.skiploom.infrastructure.web

import com.skiploom.application.queries.FetchAllRecipes
import com.skiploom.application.queries.FetchRecipeById
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/queries")
class RecipeQueryController(
    private val fetchAllRecipes: FetchAllRecipes,
    private val fetchRecipeById: FetchRecipeById
) {
    @GetMapping("/fetch_all_recipes")
    fun getAllRecipes(): ResponseEntity<FetchAllRecipes.Response> {
        return ResponseEntity.ok(fetchAllRecipes.execute(FetchAllRecipes.Query))
    }

    @GetMapping("/fetch_recipe_by_id/{id}")
    fun getRecipeById(@PathVariable id: String): ResponseEntity<FetchRecipeById.Response> {
        return ResponseEntity.ok(fetchRecipeById.execute(FetchRecipeById.Query(id)))
    }
}

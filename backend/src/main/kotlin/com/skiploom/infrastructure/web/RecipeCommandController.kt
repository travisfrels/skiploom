package com.skiploom.infrastructure.web

import com.skiploom.application.CreateRecipeCommand
import com.skiploom.application.UpdateRecipeCommand
import com.skiploom.application.command.CreateRecipe
import com.skiploom.application.command.DeleteRecipe
import com.skiploom.application.command.UpdateRecipe
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/recipes")
class RecipeCommandController(
    private val createRecipe: CreateRecipe,
    private val updateRecipe: UpdateRecipe,
    private val deleteRecipe: DeleteRecipe
) {

    @PostMapping
    fun create(@RequestBody command: CreateRecipeCommand): ResponseEntity<CreateRecipeResponse> {
        val id = createRecipe.execute(command)
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(CreateRecipeResponse(id))
    }

    @PutMapping("/{id}")
    fun update(
        @PathVariable id: String,
        @RequestBody command: UpdateRecipeCommand
    ): ResponseEntity<Unit> {
        updateRecipe.execute(id, command)
        return ResponseEntity.noContent().build()
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: String): ResponseEntity<Unit> {
        deleteRecipe.execute(id)
        return ResponseEntity.noContent().build()
    }
}

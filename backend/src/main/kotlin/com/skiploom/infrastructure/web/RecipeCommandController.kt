package com.skiploom.infrastructure.web

import com.skiploom.application.commands.CreateRecipe
import com.skiploom.application.commands.DeleteRecipe
import com.skiploom.application.commands.UpdateRecipe
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/commands")
class RecipeCommandController(
    private val createRecipe: CreateRecipe,
    private val updateRecipe: UpdateRecipe,
    private val deleteRecipe: DeleteRecipe
) {
    @PostMapping("/create_recipe")
    fun create(@Valid @RequestBody command: CreateRecipe.Command): ResponseEntity<CreateRecipe.Response> {
        return ResponseEntity
            .status(HttpStatus.OK)
            .body(createRecipe.execute(command))
    }

    @PostMapping("/update_recipe")
    fun update(@Valid @RequestBody command: UpdateRecipe.Command): ResponseEntity<UpdateRecipe.Response> {
        return ResponseEntity
            .status(HttpStatus.OK)
            .body(updateRecipe.execute(command))
    }

    @PostMapping("/delete_recipe")
    fun delete(@RequestBody command: DeleteRecipe.Command): ResponseEntity<DeleteRecipe.Response> {
        return ResponseEntity
            .status(HttpStatus.OK)
            .body(deleteRecipe.execute(command))
    }
}

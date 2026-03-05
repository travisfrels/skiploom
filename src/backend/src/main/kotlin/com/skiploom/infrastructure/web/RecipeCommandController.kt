package com.skiploom.infrastructure.web

import com.skiploom.application.commands.CreateRecipe
import com.skiploom.application.commands.DeleteRecipe
import com.skiploom.application.commands.UpdateRecipe
import com.skiploom.application.dtos.toDto
import com.skiploom.application.exceptions.IdempotencyConflictException
import com.skiploom.domain.entities.IdempotencyClaim
import com.skiploom.domain.operations.IdempotencyClaimReader
import com.skiploom.domain.operations.IdempotencyClaimWriter
import com.skiploom.domain.operations.RecipeReader
import jakarta.validation.Valid
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.Instant
import java.util.UUID

@RestController
@RequestMapping("/api/commands")
class RecipeCommandController(
    private val createRecipe: CreateRecipe,
    private val updateRecipe: UpdateRecipe,
    private val deleteRecipe: DeleteRecipe,
    private val idempotencyClaimReader: IdempotencyClaimReader,
    private val idempotencyClaimWriter: IdempotencyClaimWriter,
    private val recipeReader: RecipeReader
) {
    @PostMapping("/create_recipe")
    fun create(
        @Valid @RequestBody command: CreateRecipe.Command,
        @RequestHeader("Idempotency-Key", required = false) idempotencyKey: UUID?
    ): ResponseEntity<CreateRecipe.Response> {
        if (idempotencyKey == null) {
            return ResponseEntity.status(HttpStatus.OK).body(createRecipe.execute(command))
        }

        val existingClaim = idempotencyClaimReader.findByKey(idempotencyKey)
        if (existingClaim != null) {
            return handleExistingClaim(existingClaim)
        }

        return try {
            idempotencyClaimWriter.save(IdempotencyClaim(idempotencyKey, null, Instant.now()))
            val response = createRecipe.execute(command)
            val recipeId = UUID.fromString(response.recipe.id)
            idempotencyClaimWriter.save(IdempotencyClaim(idempotencyKey, recipeId, Instant.now()))
            ResponseEntity.status(HttpStatus.OK).body(response)
        } catch (e: DataIntegrityViolationException) {
            val claim = idempotencyClaimReader.findByKey(idempotencyKey)
                ?: throw e
            handleExistingClaim(claim)
        }
    }

    private fun handleExistingClaim(claim: IdempotencyClaim): ResponseEntity<CreateRecipe.Response> {
        val recipeId = claim.recipeId ?: throw IdempotencyConflictException(claim.idempotencyKey)
        val recipe = recipeReader.fetchById(recipeId)!!
        return ResponseEntity.status(HttpStatus.OK).body(
            CreateRecipe.Response(recipe.toDto(), CreateRecipe.Response.SUCCESS_MESSAGE)
        )
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

package com.skiploom.infrastructure.web

import com.skiploom.application.commands.CreateMealPlanEntry
import com.skiploom.application.commands.DeleteMealPlanEntry
import com.skiploom.application.commands.UpdateMealPlanEntry
import com.skiploom.application.dtos.MealPlanEntryDto
import com.skiploom.domain.operations.UserReader
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.core.oidc.user.OidcUser
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping("/api/commands")
class MealPlanEntryCommandController(
    private val createMealPlanEntry: CreateMealPlanEntry,
    private val updateMealPlanEntry: UpdateMealPlanEntry,
    private val deleteMealPlanEntry: DeleteMealPlanEntry,
    private val userReader: UserReader
) {
    data class DeleteRequest(val id: String)

    @PostMapping("/create_meal_plan_entry")
    fun create(
        @Valid @RequestBody entry: MealPlanEntryDto,
        @AuthenticationPrincipal oidcUser: OidcUser
    ): ResponseEntity<CreateMealPlanEntry.Response> {
        val userId = resolveUserId(oidcUser)
        return ResponseEntity
            .status(HttpStatus.OK)
            .body(createMealPlanEntry.execute(CreateMealPlanEntry.Command(entry, userId)))
    }

    @PostMapping("/update_meal_plan_entry")
    fun update(
        @Valid @RequestBody entry: MealPlanEntryDto,
        @AuthenticationPrincipal oidcUser: OidcUser
    ): ResponseEntity<UpdateMealPlanEntry.Response> {
        val userId = resolveUserId(oidcUser)
        return ResponseEntity
            .status(HttpStatus.OK)
            .body(updateMealPlanEntry.execute(UpdateMealPlanEntry.Command(entry, userId)))
    }

    @PostMapping("/delete_meal_plan_entry")
    fun delete(
        @RequestBody request: DeleteRequest,
        @AuthenticationPrincipal oidcUser: OidcUser
    ): ResponseEntity<DeleteMealPlanEntry.Response> {
        val userId = resolveUserId(oidcUser)
        return ResponseEntity
            .status(HttpStatus.OK)
            .body(deleteMealPlanEntry.execute(DeleteMealPlanEntry.Command(request.id, userId)))
    }

    private fun resolveUserId(oidcUser: OidcUser) =
        userReader.findByGoogleSubject(oidcUser.subject)?.id
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "User not found")
}

package com.skiploom.infrastructure.web

import com.skiploom.application.queries.FetchMealPlanEntries
import com.skiploom.domain.operations.UserReader
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.core.oidc.user.OidcUser
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException
import java.time.LocalDate

@RestController
@RequestMapping("/api/queries")
class MealPlanEntryQueryController(
    private val fetchMealPlanEntries: FetchMealPlanEntries,
    private val userReader: UserReader
) {
    @GetMapping("/fetch_meal_plan_entries")
    fun getMealPlanEntries(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) startDate: LocalDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) endDate: LocalDate,
        @AuthenticationPrincipal oidcUser: OidcUser
    ): ResponseEntity<FetchMealPlanEntries.Response> {
        val userId = userReader.findByGoogleSubject(oidcUser.subject)?.id
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "User not found")
        return ResponseEntity.ok(
            fetchMealPlanEntries.execute(FetchMealPlanEntries.Query(userId, startDate, endDate))
        )
    }
}

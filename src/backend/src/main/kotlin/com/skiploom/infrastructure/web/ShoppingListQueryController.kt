package com.skiploom.infrastructure.web

import com.skiploom.application.queries.FetchShoppingListById
import com.skiploom.application.queries.FetchShoppingLists
import com.skiploom.domain.operations.UserReader
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.core.oidc.user.OidcUser
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/queries")
class ShoppingListQueryController(
    private val fetchShoppingLists: FetchShoppingLists,
    private val fetchShoppingListById: FetchShoppingListById,
    private val userReader: UserReader
) {
    @GetMapping("/fetch_shopping_lists")
    fun getShoppingLists(
        @AuthenticationPrincipal oidcUser: OidcUser
    ): ResponseEntity<FetchShoppingLists.Response> {
        val userId = userReader.resolveUserId(oidcUser)
        return ResponseEntity.ok(
            fetchShoppingLists.execute(FetchShoppingLists.Query(userId))
        )
    }

    @GetMapping("/fetch_shopping_list_by_id/{id}")
    fun getShoppingListById(
        @PathVariable id: String,
        @AuthenticationPrincipal oidcUser: OidcUser
    ): ResponseEntity<FetchShoppingListById.Response> {
        val userId = userReader.resolveUserId(oidcUser)
        return ResponseEntity.ok(
            fetchShoppingListById.execute(FetchShoppingListById.Query(id, userId))
        )
    }
}

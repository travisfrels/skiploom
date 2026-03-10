package com.skiploom.infrastructure.web

import com.skiploom.application.commands.CreateShoppingList
import com.skiploom.application.commands.DeleteShoppingList
import com.skiploom.application.commands.UpdateShoppingList
import com.skiploom.application.dtos.ShoppingListDto
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

@RestController
@RequestMapping("/api/commands")
class ShoppingListCommandController(
    private val createShoppingList: CreateShoppingList,
    private val updateShoppingList: UpdateShoppingList,
    private val deleteShoppingList: DeleteShoppingList,
    private val userReader: UserReader
) {
    data class DeleteRequest(val id: String)

    @PostMapping("/create_shopping_list")
    fun create(
        @Valid @RequestBody list: ShoppingListDto,
        @AuthenticationPrincipal oidcUser: OidcUser
    ): ResponseEntity<CreateShoppingList.Response> {
        val userId = userReader.resolveUserId(oidcUser)
        return ResponseEntity
            .status(HttpStatus.OK)
            .body(createShoppingList.execute(CreateShoppingList.Command(list, userId)))
    }

    @PostMapping("/update_shopping_list")
    fun update(
        @Valid @RequestBody list: ShoppingListDto,
        @AuthenticationPrincipal oidcUser: OidcUser
    ): ResponseEntity<UpdateShoppingList.Response> {
        val userId = userReader.resolveUserId(oidcUser)
        return ResponseEntity
            .status(HttpStatus.OK)
            .body(updateShoppingList.execute(UpdateShoppingList.Command(list, userId)))
    }

    @PostMapping("/delete_shopping_list")
    fun delete(
        @RequestBody request: DeleteRequest,
        @AuthenticationPrincipal oidcUser: OidcUser
    ): ResponseEntity<DeleteShoppingList.Response> {
        val userId = userReader.resolveUserId(oidcUser)
        return ResponseEntity
            .status(HttpStatus.OK)
            .body(deleteShoppingList.execute(DeleteShoppingList.Command(request.id, userId)))
    }
}

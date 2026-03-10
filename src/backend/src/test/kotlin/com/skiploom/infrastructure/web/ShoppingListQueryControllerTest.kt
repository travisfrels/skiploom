package com.skiploom.infrastructure.web

import com.skiploom.application.dtos.ShoppingListDto
import com.skiploom.application.dtos.ShoppingListItemDto
import com.skiploom.application.queries.FetchShoppingListById
import com.skiploom.application.queries.FetchShoppingLists
import com.skiploom.domain.entities.User
import com.skiploom.domain.operations.UserReader
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.context.annotation.Bean
import org.springframework.security.oauth2.core.oidc.OidcIdToken
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser
import org.springframework.security.oauth2.core.oidc.user.OidcUserAuthority
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oidcLogin
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.time.Instant
import java.util.UUID

@WebMvcTest(ShoppingListQueryController::class)
class ShoppingListQueryControllerTest {

    @TestConfiguration
    class TestConfig {
        @Bean
        fun fetchShoppingLists(): FetchShoppingLists = mockk()

        @Bean
        fun fetchShoppingListById(): FetchShoppingListById = mockk()

        @Bean
        fun userReader(): UserReader = mockk()
    }

    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var fetchShoppingLists: FetchShoppingLists

    @Autowired
    private lateinit var fetchShoppingListById: FetchShoppingListById

    @Autowired
    private lateinit var userReader: UserReader

    private val userId = UUID.fromString("00000000-0000-0000-0000-000000000001")
    private val googleSubject = "google-sub-123"

    private val testUser = User(
        id = userId,
        googleSubject = googleSubject,
        email = "test@example.com",
        displayName = "Test User"
    )

    private fun oidcUser(subject: String = googleSubject): DefaultOidcUser {
        val idToken = OidcIdToken.withTokenValue("mock-token")
            .subject(subject)
            .issuedAt(Instant.now())
            .expiresAt(Instant.now().plusSeconds(3600))
            .claim("email", "test@example.com")
            .claim("name", "Test User")
            .build()
        return DefaultOidcUser(listOf(OidcUserAuthority(idToken)), idToken)
    }

    @Test
    fun `GET fetch_shopping_lists returns 200 with lists`() {
        every { userReader.findByGoogleSubject(googleSubject) } returns testUser
        val lists = listOf(
            ShoppingListDto("id-1", "Groceries", emptyList())
        )
        val expectedResponse = FetchShoppingLists.Response(lists, "Found 1 shopping list.")
        every { fetchShoppingLists.execute(any()) } returns expectedResponse

        mockMvc.perform(
            get("/api/queries/fetch_shopping_lists")
                .with(oidcLogin().oidcUser(oidcUser()))
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.lists").isArray)
            .andExpect(jsonPath("$.lists[0].title").value("Groceries"))
            .andExpect(jsonPath("$.message").value("Found 1 shopping list."))
    }

    @Test
    fun `GET fetch_shopping_lists returns 200 with empty list`() {
        every { userReader.findByGoogleSubject(googleSubject) } returns testUser
        val expectedResponse = FetchShoppingLists.Response(emptyList(), "Found 0 shopping lists.")
        every { fetchShoppingLists.execute(any()) } returns expectedResponse

        mockMvc.perform(
            get("/api/queries/fetch_shopping_lists")
                .with(oidcLogin().oidcUser(oidcUser()))
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.lists").isEmpty)
    }

    @Test
    fun `GET fetch_shopping_list_by_id returns 200 with list and items`() {
        every { userReader.findByGoogleSubject(googleSubject) } returns testUser
        val listDto = ShoppingListDto(
            "id-1", "Groceries",
            listOf(ShoppingListItemDto("item-1", "Milk", false, 1))
        )
        val expectedResponse = FetchShoppingListById.Response(listDto, FetchShoppingListById.Response.SUCCESS_MESSAGE)
        every { fetchShoppingListById.execute(any()) } returns expectedResponse

        mockMvc.perform(
            get("/api/queries/fetch_shopping_list_by_id/id-1")
                .with(oidcLogin().oidcUser(oidcUser()))
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.list.title").value("Groceries"))
            .andExpect(jsonPath("$.list.items[0].label").value("Milk"))
            .andExpect(jsonPath("$.message").value(FetchShoppingListById.Response.SUCCESS_MESSAGE))
    }
}

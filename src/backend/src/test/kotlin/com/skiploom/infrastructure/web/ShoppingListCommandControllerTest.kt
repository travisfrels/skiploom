package com.skiploom.infrastructure.web

import com.skiploom.application.commands.CreateShoppingList
import com.skiploom.application.commands.DeleteShoppingList
import com.skiploom.application.commands.UpdateShoppingList
import com.skiploom.application.dtos.ShoppingListDto
import com.skiploom.application.dtos.ShoppingListItemDto
import com.skiploom.application.exceptions.ShoppingListNotFoundException
import com.skiploom.domain.entities.ShoppingList
import com.skiploom.domain.entities.User
import com.skiploom.domain.operations.UserReader
import io.mockk.every
import io.mockk.mockk
import org.hamcrest.Matchers.hasItem
import org.hamcrest.Matchers.hasSize
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.context.annotation.Bean
import org.springframework.http.MediaType
import org.springframework.security.oauth2.core.oidc.OidcIdToken
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser
import org.springframework.security.oauth2.core.oidc.user.OidcUserAuthority
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oidcLogin
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import tools.jackson.databind.ObjectMapper
import java.time.Instant
import java.util.UUID

@WebMvcTest(ShoppingListCommandController::class)
class ShoppingListCommandControllerTest {

    @TestConfiguration
    class TestConfig {
        @Bean
        fun createShoppingList(): CreateShoppingList = mockk()

        @Bean
        fun updateShoppingList(): UpdateShoppingList = mockk()

        @Bean
        fun deleteShoppingList(): DeleteShoppingList = mockk()

        @Bean
        fun userReader(): UserReader = mockk()
    }

    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @Autowired
    private lateinit var createShoppingList: CreateShoppingList

    @Autowired
    private lateinit var updateShoppingList: UpdateShoppingList

    @Autowired
    private lateinit var deleteShoppingList: DeleteShoppingList

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

    private fun listDto(
        id: String = "",
        title: String = "Groceries",
        items: List<ShoppingListItemDto>? = null
    ) = ShoppingListDto(id, title, items)

    @Test
    fun `POST create_shopping_list returns 200 with response`() {
        every { userReader.findByGoogleSubject(googleSubject) } returns testUser
        val dto = listDto()
        val responseDto = listDto(id = "generated-id")
        val expectedResponse = CreateShoppingList.Response(responseDto, CreateShoppingList.Response.SUCCESS_MESSAGE)
        every { createShoppingList.execute(any()) } returns expectedResponse

        mockMvc.perform(
            post("/api/commands/create_shopping_list")
                .with(csrf())
                .with(oidcLogin().oidcUser(oidcUser()))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto))
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.list.id").value("generated-id"))
            .andExpect(jsonPath("$.message").value(CreateShoppingList.Response.SUCCESS_MESSAGE))
    }

    @Test
    fun `POST create_shopping_list returns 400 with field errors for invalid list`() {
        every { userReader.findByGoogleSubject(googleSubject) } returns testUser
        val dto = listDto(title = "")

        mockMvc.perform(
            post("/api/commands/create_shopping_list")
                .with(csrf())
                .with(oidcLogin().oidcUser(oidcUser()))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto))
        )
            .andExpect(status().isBadRequest)
            .andExpect(jsonPath("$.errors").isArray)
            .andExpect(jsonPath("$.errors", hasSize<Any>(1)))
            .andExpect(jsonPath("$.errors[*].field", hasItem("title")))
            .andExpect(jsonPath("$.errors[*].message", hasItem(ShoppingList.TITLE_REQUIRED_MESSAGE)))
    }

    @Test
    fun `POST update_shopping_list returns 200 with response`() {
        every { userReader.findByGoogleSubject(googleSubject) } returns testUser
        val dto = listDto(id = "00000000-0000-0000-0000-000000000002")
        val expectedResponse = UpdateShoppingList.Response(dto, UpdateShoppingList.Response.SUCCESS_MESSAGE)
        every { updateShoppingList.execute(any()) } returns expectedResponse

        mockMvc.perform(
            post("/api/commands/update_shopping_list")
                .with(csrf())
                .with(oidcLogin().oidcUser(oidcUser()))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto))
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.list.id").value("00000000-0000-0000-0000-000000000002"))
            .andExpect(jsonPath("$.message").value(UpdateShoppingList.Response.SUCCESS_MESSAGE))
    }

    @Test
    fun `POST update_shopping_list returns 404 for non-existent list`() {
        every { userReader.findByGoogleSubject(googleSubject) } returns testUser
        val dto = listDto(id = "00000000-0000-0000-0000-000000000002")
        every { updateShoppingList.execute(any()) } throws ShoppingListNotFoundException(UUID.randomUUID())

        mockMvc.perform(
            post("/api/commands/update_shopping_list")
                .with(csrf())
                .with(oidcLogin().oidcUser(oidcUser()))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto))
        )
            .andExpect(status().isNotFound)
    }

    @Test
    fun `POST delete_shopping_list returns 200 with response`() {
        every { userReader.findByGoogleSubject(googleSubject) } returns testUser
        val expectedResponse = DeleteShoppingList.Response(DeleteShoppingList.Response.SUCCESS_MESSAGE)
        every { deleteShoppingList.execute(any()) } returns expectedResponse

        mockMvc.perform(
            post("/api/commands/delete_shopping_list")
                .with(csrf())
                .with(oidcLogin().oidcUser(oidcUser()))
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"id":"00000000-0000-0000-0000-000000000001"}""")
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.message").value(DeleteShoppingList.Response.SUCCESS_MESSAGE))
    }

    @Test
    fun `POST delete_shopping_list returns 404 for non-existent list`() {
        every { userReader.findByGoogleSubject(googleSubject) } returns testUser
        every { deleteShoppingList.execute(any()) } throws ShoppingListNotFoundException(UUID.randomUUID())

        mockMvc.perform(
            post("/api/commands/delete_shopping_list")
                .with(csrf())
                .with(oidcLogin().oidcUser(oidcUser()))
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"id":"non-existent"}""")
        )
            .andExpect(status().isNotFound)
    }
}

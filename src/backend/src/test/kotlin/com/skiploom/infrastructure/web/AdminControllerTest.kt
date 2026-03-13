package com.skiploom.infrastructure.web

import com.skiploom.domain.entities.User
import com.skiploom.domain.operations.UserReader
import com.skiploom.domain.operations.UserWriter
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.context.annotation.Bean
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.model
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.view
import java.util.UUID

@WebMvcTest(AdminController::class)
@WithMockUser
class AdminControllerTest {

    @TestConfiguration
    class TestConfig {
        @Bean
        fun userReader(): UserReader = mockk()

        @Bean
        fun userWriter(): UserWriter = mockk()
    }

    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var userReader: UserReader

    @Autowired
    private lateinit var userWriter: UserWriter

    @Test
    fun `admin landing page returns view`() {
        mockMvc.perform(get("/admin/"))
            .andExpect(status().isOk)
            .andExpect(view().name("admin/index"))
    }

    @Test
    fun `account disabled page returns view`() {
        mockMvc.perform(get("/admin/account-disabled"))
            .andExpect(status().isOk)
            .andExpect(view().name("admin/account-disabled"))
    }

    @Test
    fun `user list page returns view with users`() {
        val users = listOf(
            User(
                id = UUID.fromString("00000000-0000-0000-0000-000000000001"),
                googleSubject = "google-sub-1",
                email = "user1@test.com",
                displayName = "User One",
                enabled = true
            )
        )
        every { userReader.findAll() } returns users

        mockMvc.perform(get("/admin/users"))
            .andExpect(status().isOk)
            .andExpect(view().name("admin/users"))
            .andExpect(model().attribute("users", users))
    }

    @Test
    fun `toggle enabled disables an enabled user and redirects`() {
        val userId = UUID.fromString("00000000-0000-0000-0000-000000000001")
        val user = User(
            id = userId,
            googleSubject = "google-sub-1",
            email = "user1@test.com",
            displayName = "User One",
            enabled = true
        )
        every { userReader.findById(userId) } returns user
        every { userWriter.save(any()) } answers { firstArg() }

        mockMvc.perform(
            post("/admin/users/$userId/toggle-enabled")
                .with(csrf())
        )
            .andExpect(status().is3xxRedirection)
            .andExpect(redirectedUrl("/admin/users"))

        verify { userWriter.save(user.copy(enabled = false)) }
    }

    @Test
    fun `toggle enabled enables a disabled user and redirects`() {
        val userId = UUID.fromString("00000000-0000-0000-0000-000000000001")
        val user = User(
            id = userId,
            googleSubject = "google-sub-1",
            email = "user1@test.com",
            displayName = "User One",
            enabled = false
        )
        every { userReader.findById(userId) } returns user
        every { userWriter.save(any()) } answers { firstArg() }

        mockMvc.perform(
            post("/admin/users/$userId/toggle-enabled")
                .with(csrf())
        )
            .andExpect(status().is3xxRedirection)
            .andExpect(redirectedUrl("/admin/users"))

        verify { userWriter.save(user.copy(enabled = true)) }
    }

    @Test
    fun `toggle enabled returns 404 for unknown user`() {
        val userId = UUID.fromString("00000000-0000-0000-0000-000000000099")
        every { userReader.findById(userId) } returns null

        mockMvc.perform(
            post("/admin/users/$userId/toggle-enabled")
                .with(csrf())
        )
            .andExpect(status().isNotFound)
    }
}

package com.skiploom.infrastructure.web

import com.skiploom.TestcontainersConfiguration
import com.skiploom.domain.entities.User
import com.skiploom.domain.operations.UserWriter
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import org.springframework.mock.web.MockHttpSession
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

// @WebMvcTest is insufficient here: the session/security-context assertions require
// a real HttpSession, which MockMvc's mock request does not provide.
@SpringBootTest
@AutoConfigureMockMvc
@Import(TestcontainersConfiguration::class)
@ActiveProfiles("test", "e2e")
class E2eLoginControllerTest {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var userWriter: UserWriter

    @AfterEach
    fun ensureTestUserEnabled() {
        userWriter.save(User(
            id = E2eLoginController.TEST_USER_ID,
            googleSubject = E2eLoginController.TEST_SUBJECT,
            email = E2eLoginController.TEST_EMAIL,
            displayName = E2eLoginController.TEST_DISPLAY_NAME,
            enabled = true
        ))
    }

    @Test
    fun `POST api e2e login returns 200`() {
        mockMvc.perform(post("/api/e2e/login"))
            .andExpect(status().isOk)
    }

    @Test
    fun `POST api e2e login creates a session with security context`() {
        val result = mockMvc.perform(post("/api/e2e/login"))
            .andExpect(status().isOk)
            .andReturn()

        val session = result.request.getSession(false)
        assertNotNull(session, "Expected session to be created")
        assertNotNull(session!!.getAttribute("SPRING_SECURITY_CONTEXT"), "Expected SPRING_SECURITY_CONTEXT in session")
    }

    @Test
    fun `GET api me with session from e2e login returns test user`() {
        val loginResult = mockMvc.perform(post("/api/e2e/login"))
            .andExpect(status().isOk)
            .andReturn()

        val session = loginResult.request.getSession(false) as MockHttpSession

        mockMvc.perform(
            get("/api/me").session(session)
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.email").value(E2eLoginController.TEST_EMAIL))
    }

    @Test
    fun `POST api e2e login returns 403 for disabled user`() {
        userWriter.save(User(
            id = E2eLoginController.TEST_USER_ID,
            googleSubject = E2eLoginController.TEST_SUBJECT,
            email = E2eLoginController.TEST_EMAIL,
            displayName = E2eLoginController.TEST_DISPLAY_NAME,
            enabled = false
        ))

        val result = mockMvc.perform(post("/api/e2e/login"))
            .andExpect(status().isForbidden)
            .andReturn()

        val session = result.request.getSession(false)
        assertNull(session?.getAttribute("SPRING_SECURITY_CONTEXT"), "Expected no security context for disabled user")
    }
}

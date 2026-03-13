package com.skiploom.infrastructure.web

import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.view

@WebMvcTest(AdminController::class)
@WithMockUser
class AdminControllerTest {

    @Autowired
    private lateinit var mockMvc: MockMvc

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
}

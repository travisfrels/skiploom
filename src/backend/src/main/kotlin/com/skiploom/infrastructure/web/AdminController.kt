package com.skiploom.infrastructure.web

import com.skiploom.domain.operations.UserReader
import com.skiploom.domain.operations.UserWriter
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.server.ResponseStatusException
import java.util.UUID

@Controller
@RequestMapping("/admin")
class AdminController(
    private val userReader: UserReader,
    private val userWriter: UserWriter
) {

    @GetMapping("/")
    fun index(): String {
        return "admin/index"
    }

    @GetMapping("/account-disabled")
    fun accountDisabled(): String {
        return "admin/account-disabled"
    }

    @GetMapping("/users")
    fun users(model: Model): String {
        model.addAttribute("users", userReader.findAll())
        return "admin/users"
    }

    @PostMapping("/users/{id}/toggle-enabled")
    fun toggleEnabled(@PathVariable id: UUID): String {
        val user = userReader.findById(id)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND)
        userWriter.save(user.copy(enabled = !user.enabled))
        return "redirect:/admin/users"
    }
}

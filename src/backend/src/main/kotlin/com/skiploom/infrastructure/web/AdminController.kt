package com.skiploom.infrastructure.web

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping

@Controller
@RequestMapping("/admin")
class AdminController {

    @GetMapping("/")
    fun index(): String {
        return "admin/index"
    }

    @GetMapping("/account-disabled")
    fun accountDisabled(): String {
        return "admin/account-disabled"
    }
}

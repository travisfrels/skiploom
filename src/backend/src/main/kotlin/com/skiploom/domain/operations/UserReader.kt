package com.skiploom.domain.operations

import com.skiploom.domain.entities.User
import java.util.UUID

interface UserReader {
    fun findAll(): List<User>
    fun findById(id: UUID): User?
    fun findByGoogleSubject(googleSubject: String): User?
}

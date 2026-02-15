package com.skiploom.domain.operations

import com.skiploom.domain.entities.User

interface UserReader {
    fun findByGoogleSubject(googleSubject: String): User?
}

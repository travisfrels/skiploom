package com.skiploom.domain.operations

import com.skiploom.domain.entities.User

interface UserWriter {
    fun save(user: User): User
}

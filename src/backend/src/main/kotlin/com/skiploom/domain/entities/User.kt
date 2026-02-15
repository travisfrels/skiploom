package com.skiploom.domain.entities

import java.util.UUID

data class User(
    val id: UUID,
    val googleSubject: String,
    val email: String,
    val displayName: String
)

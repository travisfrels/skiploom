package com.skiploom.infrastructure.persistence

import com.skiploom.domain.entities.User
import jakarta.persistence.*
import java.util.UUID

@Entity
@Table(name = "\"user\"")
class UserEntity(
    @Id
    var id: UUID = UUID(0, 0),

    @Column(name = "google_subject", nullable = false, unique = true)
    var googleSubject: String = "",

    @Column(name = "email", nullable = false)
    var email: String = "",

    @Column(name = "display_name", nullable = false)
    var displayName: String = ""
)

fun UserEntity.toDomain() = User(
    id = id,
    googleSubject = googleSubject,
    email = email,
    displayName = displayName
)

fun User.toEntity() = UserEntity(
    id = id,
    googleSubject = googleSubject,
    email = email,
    displayName = displayName
)

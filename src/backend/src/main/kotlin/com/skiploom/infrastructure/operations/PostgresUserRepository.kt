package com.skiploom.infrastructure.operations

import com.skiploom.domain.entities.User
import com.skiploom.domain.operations.UserReader
import com.skiploom.domain.operations.UserWriter
import com.skiploom.infrastructure.persistence.UserJpaRepository
import com.skiploom.infrastructure.persistence.toDomain
import com.skiploom.infrastructure.persistence.toEntity
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
class PostgresUserRepository(
    private val userJpaRepository: UserJpaRepository
) : UserReader, UserWriter {

    override fun findAll(): List<User> {
        return userJpaRepository.findAll().map { it.toDomain() }
    }

    override fun findById(id: UUID): User? {
        return userJpaRepository.findById(id).orElse(null)?.toDomain()
    }

    override fun findByGoogleSubject(googleSubject: String): User? {
        return userJpaRepository.findByGoogleSubject(googleSubject)?.toDomain()
    }

    override fun save(user: User): User {
        return userJpaRepository.save(user.toEntity()).toDomain()
    }
}

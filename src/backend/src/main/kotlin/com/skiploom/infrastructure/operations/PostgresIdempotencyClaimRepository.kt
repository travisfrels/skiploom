package com.skiploom.infrastructure.operations

import com.skiploom.domain.entities.IdempotencyClaim
import com.skiploom.domain.operations.IdempotencyClaimReader
import com.skiploom.domain.operations.IdempotencyClaimWriter
import com.skiploom.infrastructure.persistence.IdempotencyClaimJpaRepository
import com.skiploom.infrastructure.persistence.toDomain
import com.skiploom.infrastructure.persistence.toEntity
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
class PostgresIdempotencyClaimRepository(
    private val idempotencyClaimJpaRepository: IdempotencyClaimJpaRepository
) : IdempotencyClaimReader, IdempotencyClaimWriter {

    override fun findByKey(key: UUID): IdempotencyClaim? {
        return idempotencyClaimJpaRepository.findById(key).orElse(null)?.toDomain()
    }

    override fun save(claim: IdempotencyClaim): IdempotencyClaim {
        return idempotencyClaimJpaRepository.save(claim.toEntity()).toDomain()
    }
}

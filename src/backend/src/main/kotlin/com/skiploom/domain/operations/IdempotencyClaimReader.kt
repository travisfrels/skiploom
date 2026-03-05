package com.skiploom.domain.operations

import com.skiploom.domain.entities.IdempotencyClaim
import java.util.UUID

interface IdempotencyClaimReader {
    fun findByKey(key: UUID): IdempotencyClaim?
}

package com.skiploom.domain.operations

import com.skiploom.domain.entities.IdempotencyClaim

interface IdempotencyClaimWriter {
    fun save(claim: IdempotencyClaim): IdempotencyClaim
}

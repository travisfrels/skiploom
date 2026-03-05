package com.skiploom.infrastructure.operations

import com.skiploom.TestcontainersConfiguration
import com.skiploom.domain.entities.IdempotencyClaim
import com.skiploom.domain.operations.IdempotencyClaimReader
import com.skiploom.domain.operations.IdempotencyClaimWriter
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.util.UUID

@SpringBootTest
@Import(TestcontainersConfiguration::class)
@Transactional
class PostgresIdempotencyClaimRepositoryTest {

    @Autowired
    private lateinit var idempotencyClaimReader: IdempotencyClaimReader

    @Autowired
    private lateinit var idempotencyClaimWriter: IdempotencyClaimWriter

    private lateinit var savedClaim: IdempotencyClaim

    @BeforeEach
    fun setUp() {
        savedClaim = idempotencyClaimWriter.save(
            IdempotencyClaim(
                idempotencyKey = UUID.randomUUID(),
                recipeId = UUID.randomUUID(),
                createdAt = Instant.now()
            )
        )
    }

    @Test
    fun `findByKey returns saved claim`() {
        val claim = idempotencyClaimReader.findByKey(savedClaim.idempotencyKey)

        assertNotNull(claim)
        assertEquals(savedClaim.idempotencyKey, claim!!.idempotencyKey)
        assertEquals(savedClaim.recipeId, claim.recipeId)
    }

    @Test
    fun `findByKey returns null when claim does not exist`() {
        assertNull(idempotencyClaimReader.findByKey(UUID.randomUUID()))
    }

    @Test
    fun `save creates new claim`() {
        val newClaim = IdempotencyClaim(
            idempotencyKey = UUID.randomUUID(),
            recipeId = UUID.randomUUID(),
            createdAt = Instant.now()
        )

        val result = idempotencyClaimWriter.save(newClaim)

        assertEquals(newClaim.idempotencyKey, result.idempotencyKey)
        assertEquals(newClaim.recipeId, result.recipeId)
        val fetched = idempotencyClaimReader.findByKey(newClaim.idempotencyKey)
        assertNotNull(fetched)
        assertEquals(newClaim.recipeId, fetched!!.recipeId)
    }

    @Test
    fun `save creates claim with null recipeId`() {
        val claim = IdempotencyClaim(
            idempotencyKey = UUID.randomUUID(),
            recipeId = null,
            createdAt = Instant.now()
        )

        val result = idempotencyClaimWriter.save(claim)

        assertNull(result.recipeId)
        val fetched = idempotencyClaimReader.findByKey(claim.idempotencyKey)
        assertNotNull(fetched)
        assertNull(fetched!!.recipeId)
    }

    @Test
    fun `save updates existing claim with recipeId`() {
        val claimWithoutRecipe = idempotencyClaimWriter.save(
            IdempotencyClaim(
                idempotencyKey = UUID.randomUUID(),
                recipeId = null,
                createdAt = Instant.now()
            )
        )

        val recipeId = UUID.randomUUID()
        idempotencyClaimWriter.save(claimWithoutRecipe.copy(recipeId = recipeId))

        val fetched = idempotencyClaimReader.findByKey(claimWithoutRecipe.idempotencyKey)
        assertNotNull(fetched)
        assertEquals(recipeId, fetched!!.recipeId)
    }
}

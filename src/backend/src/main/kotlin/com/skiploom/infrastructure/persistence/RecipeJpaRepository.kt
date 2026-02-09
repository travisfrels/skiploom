package com.skiploom.infrastructure.persistence

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface RecipeJpaRepository : JpaRepository<RecipeEntity, UUID>

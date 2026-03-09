package com.skiploom.infrastructure.operations

import com.skiploom.domain.entities.ShoppingList
import com.skiploom.domain.operations.ShoppingListReader
import com.skiploom.domain.operations.ShoppingListWriter
import com.skiploom.infrastructure.persistence.*
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Repository
class PostgresShoppingListRepository(
    private val shoppingListJpaRepository: ShoppingListJpaRepository,
    private val shoppingListItemJpaRepository: ShoppingListItemJpaRepository
) : ShoppingListReader, ShoppingListWriter {

    override fun fetchById(id: UUID): ShoppingList? {
        val listEntity = shoppingListJpaRepository.findById(id).orElse(null) ?: return null
        val items = shoppingListItemJpaRepository.findByShoppingListId(id)
        return listEntity.toDomain(items)
    }

    override fun fetchByUserId(userId: UUID): List<ShoppingList> {
        val listEntities = shoppingListJpaRepository.findByUserId(userId)
        if (listEntities.isEmpty()) return emptyList()

        val itemsByList = shoppingListItemJpaRepository
            .findByShoppingListIdIn(listEntities.map { it.id })
            .groupBy { it.shoppingListId }

        return listEntities.map { entity ->
            entity.toDomain(itemsByList[entity.id] ?: emptyList())
        }
    }

    @Transactional
    override fun save(shoppingList: ShoppingList): ShoppingList {
        shoppingListJpaRepository.save(shoppingList.toShoppingListEntity())
        shoppingListItemJpaRepository.deleteByShoppingListId(shoppingList.id)
        shoppingListItemJpaRepository.saveAll(shoppingList.toShoppingListItemEntities())
        return shoppingList
    }

    @Transactional
    override fun delete(id: UUID): Boolean {
        if (!shoppingListJpaRepository.existsById(id)) return false
        shoppingListJpaRepository.deleteById(id)
        return true
    }
}

package com.skiploom.application.validators

import com.skiploom.application.dtos.Ordered
import jakarta.validation.ConstraintValidator
import jakarta.validation.ConstraintValidatorContext

class ContiguousOrderValidator : ConstraintValidator<ContiguousOrder, List<*>> {

    override fun isValid(value: List<*>?, context: ConstraintValidatorContext?): Boolean {
        if (value.isNullOrEmpty()) return true
        val ordered = value.filterIsInstance<Ordered>()
        if (ordered.size != value.size) return false
        val sorted = ordered.map { it.orderIndex }.sorted()
        return sorted == (1..value.size).toList()
    }
}

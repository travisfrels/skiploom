package com.skiploom.infrastructure.config

import org.togglz.core.annotation.Label

enum class SkiploomFeatures {

    @Label("Example Feature")
    EXAMPLE_FEATURE,

    @Label("Ingredient Fraction Amounts")
    FRACTION_AMOUNTS,

    @Label("Meal Planning")
    MEAL_PLANNING,

    @Label("Shopping List")
    SHOPPING_LIST
}

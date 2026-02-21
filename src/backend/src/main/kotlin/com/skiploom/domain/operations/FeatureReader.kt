package com.skiploom.domain.operations

interface FeatureReader {
    fun isEnabled(featureName: String): Boolean
    fun fetchAll(): Map<String, Boolean>
}

package com.skiploom.application.queries

import com.skiploom.domain.operations.FeatureReader
import org.springframework.stereotype.Service

@Service
class FetchFeatureFlags(
    private val featureReader: FeatureReader
) {
    object Query

    data class Response(val featureFlags: Map<String, Boolean>, val message: String)

    fun execute(query: Query): Response {
        val allFlags = featureReader.fetchAll()
        return Response(allFlags, "${allFlags.size} feature flags found.")
    }
}

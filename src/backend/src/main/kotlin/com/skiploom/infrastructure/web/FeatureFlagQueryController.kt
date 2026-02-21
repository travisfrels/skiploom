package com.skiploom.infrastructure.web

import com.skiploom.application.queries.FetchFeatureFlags
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/queries")
class FeatureFlagQueryController(
    private val fetchFeatureFlags: FetchFeatureFlags
) {
    @GetMapping("/fetch_feature_flags")
    fun getFeatureFlags(): ResponseEntity<FetchFeatureFlags.Response> {
        return ResponseEntity.ok(fetchFeatureFlags.execute(FetchFeatureFlags.Query))
    }
}

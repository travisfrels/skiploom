package com.skiploom.infrastructure.operations

import com.skiploom.domain.operations.FeatureReader
import com.skiploom.infrastructure.config.SkiploomFeatures
import org.springframework.stereotype.Component
import org.togglz.core.Feature
import org.togglz.core.manager.FeatureManager

@Component
class TogglzFeatureReader(
    private val featureManager: FeatureManager
) : FeatureReader {

    override fun isEnabled(featureName: String): Boolean {
        val enumValue = SkiploomFeatures.valueOf(featureName)
        return featureManager.isActive(Feature { enumValue.name })
    }

    override fun fetchAll(): Map<String, Boolean> {
        return SkiploomFeatures.entries.associate { feature ->
            feature.name to featureManager.isActive(Feature { feature.name })
        }
    }
}

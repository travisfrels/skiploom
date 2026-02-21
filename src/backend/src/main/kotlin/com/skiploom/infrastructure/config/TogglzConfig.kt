package com.skiploom.infrastructure.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.togglz.core.repository.jdbc.JDBCStateRepository
import org.togglz.kotlin.EnumClassFeatureProvider
import javax.sql.DataSource

@Configuration
class TogglzConfig {

    @Bean
    fun featureProvider() = EnumClassFeatureProvider(SkiploomFeatures::class.java)

    @Bean
    fun stateRepository(dataSource: DataSource): JDBCStateRepository {
        return JDBCStateRepository.newBuilder(dataSource)
            .tableName("togglz")
            .createTable(false)
            .build()
    }
}

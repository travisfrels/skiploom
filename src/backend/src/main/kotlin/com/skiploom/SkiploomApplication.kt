package com.skiploom

import com.skiploom.infrastructure.config.OAuth2ConfigurationProperties
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.runApplication

@SpringBootApplication
@EnableConfigurationProperties(OAuth2ConfigurationProperties::class)
class SkiploomApplication

fun main(args: Array<String>) {
    runApplication<SkiploomApplication>(*args)
}

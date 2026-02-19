package com.skiploom.infrastructure.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.core.annotation.Order
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.context.HttpSessionSecurityContextRepository

@Configuration
@Profile("e2e")
class E2eSecurityConfig {
    @Bean
    @Order(1)
    fun e2eSecurityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .securityMatcher("/api/e2e/**")
            .authorizeHttpRequests { auth -> auth.anyRequest().permitAll() }
            .csrf { it.disable() }
        return http.build()
    }

    @Bean
    fun e2eSecurityContextRepository(): HttpSessionSecurityContextRepository =
        HttpSessionSecurityContextRepository()
}

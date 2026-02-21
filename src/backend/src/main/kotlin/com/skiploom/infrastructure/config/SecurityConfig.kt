package com.skiploom.infrastructure.config

import com.skiploom.domain.operations.UserReader
import com.skiploom.domain.operations.UserWriter
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Lazy
import org.springframework.http.HttpStatus
import org.springframework.security.config.Customizer
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.HttpStatusEntryPoint
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler
import org.springframework.security.web.csrf.CookieCsrfTokenRepository
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler
import org.springframework.security.web.csrf.CsrfFilter
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher

@Configuration
@EnableWebSecurity
class SecurityConfig {

    @Bean
    fun userPersistingAuthenticationSuccessHandler(
        @Lazy userReader: UserReader,
        @Lazy userWriter: UserWriter,
        @Value("\${skiploom.cors.allowed-origins}") frontendOrigin: String
    ): UserPersistingAuthenticationSuccessHandler {
        return UserPersistingAuthenticationSuccessHandler(
            userReader,
            userWriter,
            SimpleUrlAuthenticationSuccessHandler(frontendOrigin)
        )
    }

    @Bean
    fun securityFilterChain(
        http: HttpSecurity,
        successHandler: UserPersistingAuthenticationSuccessHandler
    ): SecurityFilterChain {
        http
            .authorizeHttpRequests { auth ->
                auth
                    .requestMatchers("/api/health").permitAll()
                    .requestMatchers("/api/**").authenticated()
                    .requestMatchers("/togglz-console/**").authenticated()
                    .anyRequest().permitAll()
            }
            .oauth2Login { oauth2 ->
                oauth2.successHandler(successHandler)
            }
            .exceptionHandling { exceptions ->
                exceptions.defaultAuthenticationEntryPointFor(
                    HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED),
                    PathPatternRequestMatcher.pathPattern("/api/**")
                )
                exceptions.defaultAuthenticationEntryPointFor(
                    HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED),
                    PathPatternRequestMatcher.pathPattern("/togglz-console/**")
                )
            }
            .cors(Customizer.withDefaults())
            .csrf { csrf ->
                csrf
                    .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                    .csrfTokenRequestHandler(CsrfTokenRequestAttributeHandler())
            }
            .addFilterAfter(CsrfTokenMaterializingFilter(), CsrfFilter::class.java)

        return http.build()
    }
}

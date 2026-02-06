package com.skiploom.infrastructure.web

import jakarta.servlet.http.HttpServletRequest
import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.http.ProblemDetail
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import java.net.URI

@ControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
class ValidationExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidationErrors(
        ex: MethodArgumentNotValidException,
        request: HttpServletRequest
    ): ResponseEntity<ProblemDetail> {
        val body = ex.body
        body.instance = URI.create(request.requestURI)
        body.setProperty("errors", ex.bindingResult.fieldErrors.map { fieldError ->
            mapOf(
                "field" to fieldError.field.substringAfter("."),
                "message" to (fieldError.defaultMessage ?: "Invalid value")
            )
        })
        return ResponseEntity.status(body.status).body(body)
    }
}

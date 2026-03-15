package com.skiploom.infrastructure.config

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.web.filter.OncePerRequestFilter
import org.springframework.web.util.ContentCachingResponseWrapper

class TogglzConsoleNavigationFilter : OncePerRequestFilter() {

    companion object {
        private val NAV_HTML = """
            <div style="background:#f8f9fa;padding:8px 16px;border-bottom:1px solid #dee2e6;font-family:sans-serif;font-size:14px;">
                <a href="/admin/">Back to Admin</a>
            </div>
        """.trimIndent()
    }

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val wrappedResponse = ContentCachingResponseWrapper(response)
        filterChain.doFilter(request, wrappedResponse)

        if (wrappedResponse.status in 300..399) {
            wrappedResponse.copyBodyToResponse()
            return
        }

        val contentType = wrappedResponse.contentType
        if (contentType == null || !contentType.contains("text/html")) {
            wrappedResponse.copyBodyToResponse()
            return
        }

        val encoding = wrappedResponse.characterEncoding ?: "UTF-8"
        val originalBody = String(wrappedResponse.contentAsByteArray, charset(encoding))

        val bodyTagStart = originalBody.indexOf("<body", ignoreCase = true)
        if (bodyTagStart == -1) {
            wrappedResponse.copyBodyToResponse()
            return
        }

        val bodyTagEnd = originalBody.indexOf('>', bodyTagStart)
        if (bodyTagEnd == -1) {
            wrappedResponse.copyBodyToResponse()
            return
        }

        val insertPosition = bodyTagEnd + 1
        val modifiedBody = originalBody.substring(0, insertPosition) +
            NAV_HTML +
            originalBody.substring(insertPosition)

        val modifiedBytes = modifiedBody.toByteArray(charset(encoding))
        wrappedResponse.resetBuffer()
        response.setContentLength(modifiedBytes.size)
        response.outputStream.write(modifiedBytes)
    }
}

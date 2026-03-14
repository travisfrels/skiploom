package com.skiploom.infrastructure.config

import jakarta.servlet.FilterChain
import jakarta.servlet.ServletRequest
import jakarta.servlet.ServletResponse
import jakarta.servlet.http.HttpServletResponse
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.mock.web.MockHttpServletResponse

class TogglzConsoleNavigationFilterTest {

    private val filter = TogglzConsoleNavigationFilter()

    private fun createFilterChain(
        contentType: String,
        body: String,
        status: Int = 200
    ): FilterChain {
        return FilterChain { _: ServletRequest, res: ServletResponse ->
            val response = res as HttpServletResponse
            response.contentType = contentType
            response.status = status
            response.writer.write(body)
        }
    }

    @Test
    fun `injects navigation bar after body tag in HTML response`() {
        val html = "<html><body><h1>Togglz</h1></body></html>"
        val chain = createFilterChain("text/html", html)
        val request = MockHttpServletRequest()
        val response = MockHttpServletResponse()

        filter.doFilter(request, response, chain)

        val result = response.contentAsString
        assertTrue(result.contains("""<a href="/admin/">"""))
        assertTrue(result.contains("Back to Admin"))
        assertTrue(result.indexOf("""<a href="/admin/">""") > result.indexOf("<body>"))
        assertTrue(result.indexOf("""<a href="/admin/">""") < result.indexOf("<h1>Togglz</h1>"))
    }

    @Test
    fun `injects navigation bar after body tag with attributes`() {
        val html = """<html><body class="togglz"><h1>Togglz</h1></body></html>"""
        val chain = createFilterChain("text/html", html)
        val request = MockHttpServletRequest()
        val response = MockHttpServletResponse()

        filter.doFilter(request, response, chain)

        val result = response.contentAsString
        assertTrue(result.contains("""<a href="/admin/">"""))
        assertTrue(result.contains("Back to Admin"))
        val bodyCloseIndex = result.indexOf("""class="togglz">""") + """class="togglz">""".length
        assertTrue(result.indexOf("""<a href="/admin/">""") >= bodyCloseIndex)
    }

    @Test
    fun `passes through non-HTML response unmodified`() {
        val css = "body { color: red; }"
        val chain = createFilterChain("text/css", css)
        val request = MockHttpServletRequest()
        val response = MockHttpServletResponse()

        filter.doFilter(request, response, chain)

        assertEquals(css, response.contentAsString)
    }

    @Test
    fun `passes through redirect response unmodified`() {
        val chain = FilterChain { _: ServletRequest, res: ServletResponse ->
            val response = res as HttpServletResponse
            response.status = 302
            response.setHeader("Location", "/togglz-console/edit")
        }
        val request = MockHttpServletRequest()
        val response = MockHttpServletResponse()

        filter.doFilter(request, response, chain)

        assertEquals(302, response.status)
        assertEquals("", response.contentAsString)
    }

    @Test
    fun `injected HTML contains link to admin with correct text`() {
        val html = "<html><body><p>Content</p></body></html>"
        val chain = createFilterChain("text/html", html)
        val request = MockHttpServletRequest()
        val response = MockHttpServletResponse()

        filter.doFilter(request, response, chain)

        val result = response.contentAsString
        assertTrue(result.contains("""<a href="/admin/">Back to Admin</a>"""))
    }

    @Test
    fun `passes through HTML response without body tag unmodified`() {
        val html = "<html><head><title>Test</title></head></html>"
        val chain = createFilterChain("text/html", html)
        val request = MockHttpServletRequest()
        val response = MockHttpServletResponse()

        filter.doFilter(request, response, chain)

        assertEquals(html, response.contentAsString)
    }
}

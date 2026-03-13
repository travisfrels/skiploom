# V1.06 Admin Site

| Status | Set On |
|--------|--------|
| Draft | 2026-03-13 |
| Active | 2026-03-13 |

## Context

### Situation

The Skiploom backend is a pure REST API (Kotlin/Spring, CQRS, Clean Architecture) with no server-rendered HTML capability. The only non-API UI served by the backend is the Togglz admin console, a pre-built servlet from the Togglz library at `/togglz-console/`.

The frontend is a React/TypeScript SPA served by Nginx (production) or Vite (development). It proxies `/api/`, `/oauth2/`, and `/login/oauth2/` to the backend. Authentication uses Google OAuth2, establishing an HTTP session on the backend. The Togglz console is **not** proxied — users must authenticate via the frontend, then manually navigate to a separate backend port.

The user domain model has four fields: `id`, `googleSubject`, `email`, `displayName`. There is no `enabled`/`disabled` state, no roles, no authorization layer. Users are auto-created on first OAuth2 login and cannot be disabled. The only way to revoke access is to rotate Google OAuth2 credentials entirely.

### Opportunity

1. **Unnatural admin access**: Reaching the Togglz console requires authenticating via the frontend first, then navigating to a separate backend port/URL. Documentation was updated to describe this flow, but the underlying UX problem remains.
2. **No admin site**: The Togglz console is the first admin tool, but there's no admin home or navigation structure to host it and future admin capabilities.
3. **No user management**: Users cannot be disabled once created. There is no mechanism to revoke individual user access.

### Approach

Add a Thymeleaf-based admin site to the backend, proxied through the frontend for single-origin access. The admin site provides a landing page with navigation to the Togglz console and a user management page. See [ADR-OP-ADMINUI-20260313](../adrs/ADR-OP-ADMINUI-20260313.md).

#### Alternatives not chosen

- **Separate admin container** — Deployment, networking, and session-sharing complexity disproportionate for a ~5-user system. Over-engineered.
- **Frontend-integrated admin** — The Togglz console is a server-rendered servlet that cannot be embedded in React without iframes. Mixing admin into the consumer SPA violates separation of concerns.

#### Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Admin UI rendering | Thymeleaf (Spring Boot default) | Standard Spring MVC pattern; coexists with Togglz servlet on same origin ([ADR-OP-ADMINUI-20260313](../adrs/ADR-OP-ADMINUI-20260313.md)) |
| Admin access path | Proxy `/admin/` and `/togglz-console/` through frontend | Eliminates port-switching; reuses existing proxy pattern for `/api/` |
| User disable mechanism | `enabled` boolean on User entity | Spring Security convention; checked during authentication success handling |
| Disabled user enforcement | Check in `UserPersistingAuthenticationSuccessHandler` | Intercepts after OAuth2 succeeds but before session is established; redirects to error page if disabled |
| Admin authorization | All authenticated users (no roles) | Single-user system; adding roles is YAGNI — can be layered on later without architectural changes |
| CSRF for Togglz console | Validate during implementation | Spring CSRF may already work via cookie; exempt only if POST actions fail with 403 |
| Post-login redirect | `SavedRequestAwareAuthenticationSuccessHandler` | Users navigating to `/admin/` while unauthenticated return to `/admin/` after OAuth2 login, not the frontend root; standard Spring Security pattern |

## Goals

- Backend-served admin site with a landing page, navigation to Togglz console, and user management
- Natural authentication flow — sign in once, reach admin through same origin
- Ability to disable user accounts, preventing disabled users from authenticating

## Non-Goals

- Role-based access control (all authenticated users are admins)
- Custom feature flag management UI (Togglz console is sufficient)
- Admin branding, theming, or design system
- User creation, deletion, or profile editing through admin (users are auto-created via OAuth2)

## Exit Criteria

- [ ] Admin landing page is accessible at `/admin/` through the frontend origin after OAuth2 sign-in, with navigation links to the Togglz console and user management
- [ ] Togglz console is accessible at `/togglz-console/` through the frontend origin, and feature flags can be toggled (POST actions work through the proxy)
- [ ] User management page lists all users with their email, display name, and enabled status
- [ ] An admin can disable a user account through the user management page
- [ ] A disabled user is rejected during OAuth2 authentication and shown an error message
- [ ] An admin can re-enable a previously disabled user account
- [ ] Unauthenticated requests to `/admin/**` redirect to the OAuth2 login flow (not 401)
- [ ] E2E test verifies admin landing page is accessible and navigable after authentication
- [ ] E2E test verifies disabling a user prevents that user from authenticating

## References

- [V1.06 Admin Site Milestone](https://github.com/travisfrels/skiploom/milestone/12)
- [#272 Add admin landing page with proxy](https://github.com/travisfrels/skiploom/issues/272)
- [#273 Add user enabled field with disabled account enforcement](https://github.com/travisfrels/skiploom/issues/273)
- [#274 Add user management admin page](https://github.com/travisfrels/skiploom/issues/274)

### Follow-Up Issues

### Pull Requests

- [#275 Create V1.06 Admin Site project](https://github.com/travisfrels/skiploom/pull/275)

### Design References

- [Spring Boot Thymeleaf documentation](https://docs.spring.io/spring-boot/reference/web/servlet.html#web.servlet.spring-mvc.template-engines)
- [Thymeleaf Standard Layout System](https://www.thymeleaf.org/doc/tutorials/3.1/Using-Thymeleaf.html#template-layout)
- [Togglz Spring Boot Starter](https://www.togglz.com/documentation/spring-boot-starter.html)
- [ADR-OP-ADMINUI-20260313](../adrs/ADR-OP-ADMINUI-20260313.md)

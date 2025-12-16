# Technical Summary

## Architecture Overview

### Backend (Django + GraphQL)
- **Framework**: Django was chosen for its robust ORM and rapid development capabilities.
- **API Layer**: Graphene-Django provides a schema-first approach to building GraphQL APIs, allowing flexible data querying from the frontend.
- **Database**: PostgreSQL is the production database, offering reliability and JSON support if needed. (SQLite used for dev simplicity).

### Multi-Tenancy Strategy
Selected **Row-Level Isolation** (Shared Database, Shared Schema) over Schema-Per-Tenant.
- **Reasoning**: Simpler to maintain migrations and backups. Lower infrastructure overhead.
- **Implementation**: Every query requires an `organization_slug`. Middleware or resolver logic ensures data is filtered by this slug. Foreign keys link all data back to an Organization.

### Frontend (React + Apollo)
- **State Management**: Apollo Client handles remote data caching and state, reducing the need for Redux/Context for server state.
- **Styling**: TailwindCSS allows for rapid UI development with a consistent design system.
- **Optimistic UI**: Mutations update the UI immediately before the server responds, providing a snappy experience.

## Trade-offs Made

1.  **Authentication**:
    - *Decision*: Skipped full auth (JWT/Session) to focus on core multi-tenancy and CRUD logic.
    - *Implication*: Security relies on knowing the organization slug.
    - *Future Work*: Implement JWT authentication and link Users to Organizations.

2.  **Type Safety**:
    - *Decision*: Manual type definitions in frontend.
    - *Future Work*: Use GraphQL Code Generator to automatically generate TypeScript types from the schema.

3.  **Real-time**:
    - *Decision*: Polling/Refetching instead of Subscriptions.
    - *Future Work*: Implement Django Channels or Graphene Subscriptions for real-time updates (e.g., seeing comments appear instantly).

## Future Improvements

1.  **Authentication & Authorization**: Add User model and role-based access control (RBAC).
2.  **CI/CD**: Add GitHub Actions workflow for automated testing and linting.
3.  **Docker Production**: Create a multi-stage Dockerfile for optimized production builds.
4.  **Advanced Filtering**: Add filtering by assignee, due date, and priority in the GraphQL schema.

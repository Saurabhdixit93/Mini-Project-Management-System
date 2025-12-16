# Technical Summary

## Architecture Overview

### Backend (Django + GraphQL)

- **Framework**: Django was chosen for its robust ORM and rapid development capabilities.
- **API Layer**: Graphene-Django provides a schema-first approach to building GraphQL APIs, allowing flexible data querying from the frontend.
- **Database**: PostgreSQL is the production database, offering reliability and JSON support if needed. (SQLite used for dev simplicity).
- **Containerization**: Docker support for easy deployment and consistent environments.

### Multi-Tenancy Strategy

Selected **Row-Level Isolation** (Shared Database, Shared Schema) over Schema-Per-Tenant.

- **Reasoning**: Simpler to maintain migrations and backups. Lower infrastructure overhead.
- **Implementation**: Every query requires an `organization_slug`. Middleware or resolver logic ensures data is filtered by this slug. Foreign keys link all data back to an Organization.

### Frontend (React + Apollo)

- **State Management**: Apollo Client handles remote data caching and state, reducing the need for Redux/Context for server state.
- **Styling**: TailwindCSS allows for rapid UI development with a consistent design system.
- **Optimistic UI**: Mutations update the UI immediately before the server responds, providing a snappy experience.
- **Accessibility**: WCAG compliant components with proper ARIA attributes for better usability.
- **Responsive Design**: Mobile-first approach with adaptive layouts for all screen sizes.
- **Drag-and-Drop**: HTML5 Drag and Drop API implementation for intuitive task management.

## Trade-offs Made

1.  **Authentication**:

    - _Decision_: Skipped full auth (JWT/Session) to focus on core multi-tenancy and CRUD logic.
    - _Implication_: Security relies on knowing the organization slug.
    - _Future Work_: Implement JWT authentication and link Users to Organizations.

2.  **Type Safety**:

    - _Decision_: Manual type definitions in frontend.
    - _Future Work_: Use GraphQL Code Generator to automatically generate TypeScript types from the schema.

3.  **Real-time**:

    - _Decision_: Polling/Refetching instead of Subscriptions.
    - _Future Work_: Implement Django Channels or Graphene Subscriptions for real-time updates (e.g., seeing comments appear instantly).

4.  **Drag-and-Drop Library**:
    - _Decision_: Used native HTML5 Drag and Drop API instead of react-beautiful-dnd.
    - _Reasoning_: react-beautiful-dnd is deprecated and had compatibility issues with React 18+.
    - _Future Work_: Consider alternative libraries like @dnd-kit if more advanced features are needed.

## Future Improvements

1.  **Authentication & Authorization**: Add User model and role-based access control (RBAC).
2.  **CI/CD**: Add GitHub Actions workflow for automated testing and linting.
3.  **Docker Production**: Create a multi-stage Dockerfile for optimized production builds.
4.  **Advanced Filtering**: Add filtering by assignee, due date, and priority in the GraphQL schema.
5.  **Real-time Updates**: Implement WebSocket subscriptions for live data updates.
6.  **Enhanced Testing**: Expand test coverage for both frontend and backend components.
7.  **Performance Monitoring**: Add logging and metrics collection for better observability.
8.  **Internationalization**: Add support for multiple languages and locales.

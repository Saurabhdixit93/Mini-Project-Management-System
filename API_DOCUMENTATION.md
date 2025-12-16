# API Documentation

The backend exposes a GraphQL API at `/graphql/`.

## Schema

### Types

```graphql
type Organization {
  id: ID!
  name: String!
  slug: String!
  contactEmail: String!
}

type Project {
  id: ID!
  name: String!
  description: String
  status: String
  dueDate: Date
  taskCount: Int
  completedTasks: Int
}

type Task {
  id: ID!
  title: String!
  description: String
  status: String
  assigneeEmail: String
  dueDate: DateTime
}
```

## Queries

### Get Projects

Fetch all projects for an organization.

```graphql
query GetProjects($organizationSlug: String!) {
  projects(organizationSlug: $organizationSlug) {
    id
    name
    status
    taskCount
    completedTasks
  }
}
```

### Get Project Details

Fetch a single project with its tasks.

```graphql
query GetProject($id: ID!, $organizationSlug: String!) {
  project(id: $id, organizationSlug: $organizationSlug) {
    id
    name
    description
    tasks {
      id
      title
      status
    }
  }
}
```

### Get Project Examples

Fetch aggregate statistics.

```graphql
query GetStats($organizationSlug: String!) {
  projectStats(organizationSlug: $organizationSlug) {
    totalProjects
    activeProjects
    completionRate
  }
}
```

## Mutations

### Create Project

```graphql
mutation CreateProject($input: CreateProjectInput!) {
  createProject(
    organizationSlug: "acme-corp"
    name: "New Project"
    status: "ACTIVE"
  ) {
    success
    project {
      id
      name
    }
  }
}
```

### Create Task

```graphql
mutation CreateTask($projectId: ID!, $title: String!) {
  createTask(projectId: $projectId, title: $title) {
    success
    task {
      id
      status
    }
  }
}
```

### Update Task Status

```graphql
mutation UpdateTask($id: ID!, $status: String!) {
  updateTask(id: $id, status: $status) {
    success
    task {
      id
      status
    }
  }
}
```

## Error Handling

All mutations return a `success` boolean and an `errors` list strings.

```json
{
  "data": {
    "createProject": {
      "success": false,
      "errors": ["Organization not found"]
    }
  }
}
```

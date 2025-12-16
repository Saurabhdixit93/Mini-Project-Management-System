import { gql } from "@apollo/client";

export const CREATE_PROJECT = gql`
  mutation CreateProject(
    $organizationSlug: String!
    $name: String!
    $description: String
    $status: String
    $dueDate: Date
  ) {
    createProject(
      organizationSlug: $organizationSlug
      name: $name
      description: $description
      status: $status
      dueDate: $dueDate
    ) {
      success
      errors
      project {
        id
        name
        description
        status
        dueDate
        taskCount
        completedTasks
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject(
    $id: ID!
    $organizationSlug: String!
    $name: String
    $description: String
    $status: String
    $dueDate: Date
  ) {
    updateProject(
      id: $id
      organizationSlug: $organizationSlug
      name: $name
      description: $description
      status: $status
      dueDate: $dueDate
    ) {
      success
      errors
      project {
        id
        name
        description
        status
        dueDate
        taskCount
        completedTasks
        createdAt
        updatedAt
      }
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask(
    $projectId: ID!
    $title: String!
    $description: String
    $status: String
    $assigneeEmail: String
    $dueDate: DateTime
  ) {
    createTask(
      projectId: $projectId
      title: $title
      description: $description
      status: $status
      assigneeEmail: $assigneeEmail
      dueDate: $dueDate
    ) {
      success
      errors
      task {
        id
        title
        description
        status
        assigneeEmail
        dueDate
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask(
    $id: ID!
    $title: String
    $description: String
    $status: String
    $assigneeEmail: String
    $dueDate: DateTime
  ) {
    updateTask(
      id: $id
      title: $title
      description: $description
      status: $status
      assigneeEmail: $assigneeEmail
      dueDate: $dueDate
    ) {
      success
      errors
      task {
        id
        title
        description
        status
        assigneeEmail
        dueDate
        createdAt
        updatedAt
      }
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($taskId: ID!, $content: String!, $authorEmail: String!) {
    addComment(taskId: $taskId, content: $content, authorEmail: $authorEmail) {
      success
      errors
      comment {
        id
        content
        authorEmail
        createdAt
      }
    }
  }
`;

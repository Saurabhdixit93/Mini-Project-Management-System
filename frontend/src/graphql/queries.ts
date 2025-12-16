import { gql } from '@apollo/client';

export const GET_PROJECTS = gql`
  query GetProjects($organizationSlug: String!) {
    projects(organizationSlug: $organizationSlug) {
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
`;

export const GET_PROJECT = gql`
  query GetProject($id: ID!, $organizationSlug: String!) {
    project(id: $id, organizationSlug: $organizationSlug) {
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
`;

export const GET_TASKS = gql`
  query GetTasks($projectId: ID!, $organizationSlug: String!) {
    tasks(projectId: $projectId, organizationSlug: $organizationSlug) {
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
`;

export const GET_PROJECT_STATS = gql`
  query GetProjectStats($organizationSlug: String!) {
    projectStats(organizationSlug: $organizationSlug) {
      totalProjects
      activeProjects
      completedProjects
      totalTasks
      completedTasks
      completionRate
    }
  }
`;

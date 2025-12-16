import graphene
from graphene_django import DjangoObjectType
from django.db.models import Count, Q
from .models import Organization, Project, Task, TaskComment


# GraphQL Types
class OrganizationType(DjangoObjectType):
    class Meta:
        model = Organization
        fields = ('id', 'name', 'slug', 'contact_email', 'created_at')


class ProjectType(DjangoObjectType):
    task_count = graphene.Int()
    completed_tasks = graphene.Int()

    class Meta:
        model = Project
        fields = ('id', 'organization', 'name', 'description', 'status', 
                  'due_date', 'created_at', 'updated_at')

    def resolve_task_count(self, info):
        return self.tasks.count()

    def resolve_completed_tasks(self, info):
        return self.tasks.filter(status='DONE').count()


class TaskType(DjangoObjectType):
    class Meta:
        model = Task
        fields = ('id', 'project', 'title', 'description', 'status', 
                  'assignee_email', 'due_date', 'created_at', 'updated_at')


class TaskCommentType(DjangoObjectType):
    class Meta:
        model = TaskComment
        fields = ('id', 'task', 'content', 'author_email', 'created_at')


# Project Statistics Type
class ProjectStatsType(graphene.ObjectType):
    total_projects = graphene.Int()
    active_projects = graphene.Int()
    completed_projects = graphene.Int()
    total_tasks = graphene.Int()
    completed_tasks = graphene.Int()
    completion_rate = graphene.Float()


# Queries
class Query(graphene.ObjectType):
    projects = graphene.List(
        ProjectType,
        organization_slug=graphene.String(required=True)
    )
    project = graphene.Field(
        ProjectType,
        id=graphene.ID(required=True),
        organization_slug=graphene.String(required=True)
    )
    tasks = graphene.List(
        TaskType,
        project_id=graphene.ID(required=True),
        organization_slug=graphene.String(required=True)
    )
    project_stats = graphene.Field(
        ProjectStatsType,
        organization_slug=graphene.String(required=True)
    )

    def resolve_projects(self, info, organization_slug):
        try:
            org = Organization.objects.get(slug=organization_slug)
            return Project.objects.filter(organization=org).prefetch_related('tasks')
        except Organization.DoesNotExist:
            return []

    def resolve_project(self, info, id, organization_slug):
        try:
            org = Organization.objects.get(slug=organization_slug)
            return Project.objects.prefetch_related('tasks').get(
                id=id,
                organization=org
            )
        except (Organization.DoesNotExist, Project.DoesNotExist):
            return None

    def resolve_tasks(self, info, project_id, organization_slug):
        try:
            org = Organization.objects.get(slug=organization_slug)
            project = Project.objects.get(id=project_id, organization=org)
            return Task.objects.filter(project=project).prefetch_related('comments')
        except (Organization.DoesNotExist, Project.DoesNotExist):
            return []

    def resolve_project_stats(self, info, organization_slug):
        try:
            org = Organization.objects.get(slug=organization_slug)
            projects = Project.objects.filter(organization=org)
            
            total_projects = projects.count()
            active_projects = projects.filter(status='ACTIVE').count()
            completed_projects = projects.filter(status='COMPLETED').count()
            
            tasks = Task.objects.filter(project__organization=org)
            total_tasks = tasks.count()
            completed_tasks = tasks.filter(status='DONE').count()
            
            completion_rate = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
            
            return ProjectStatsType(
                total_projects=total_projects,
                active_projects=active_projects,
                completed_projects=completed_projects,
                total_tasks=total_tasks,
                completed_tasks=completed_tasks,
                completion_rate=completion_rate
            )
        except Organization.DoesNotExist:
            return None


# Mutations
class CreateProject(graphene.Mutation):
    class Arguments:
        organization_slug = graphene.String(required=True)
        name = graphene.String(required=True)
        description = graphene.String()
        status = graphene.String()
        due_date = graphene.Date()

    project = graphene.Field(ProjectType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, organization_slug, name, description="", status="ACTIVE", due_date=None):
        try:
            org = Organization.objects.get(slug=organization_slug)
            project = Project.objects.create(
                organization=org,
                name=name,
                description=description,
                status=status,
                due_date=due_date
            )
            return CreateProject(project=project, success=True, errors=[])
        except Organization.DoesNotExist:
            return CreateProject(project=None, success=False, errors=["Organization not found"])
        except Exception as e:
            return CreateProject(project=None, success=False, errors=[str(e)])


class UpdateProject(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        organization_slug = graphene.String(required=True)
        name = graphene.String()
        description = graphene.String()
        status = graphene.String()
        due_date = graphene.Date()

    project = graphene.Field(ProjectType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, id, organization_slug, name=None, description=None, status=None, due_date=None):
        try:
            org = Organization.objects.get(slug=organization_slug)
            project = Project.objects.get(id=id, organization=org)
            
            if name is not None:
                project.name = name
            if description is not None:
                project.description = description
            if status is not None:
                project.status = status
            if due_date is not None:
                project.due_date = due_date
            
            project.save()
            return UpdateProject(project=project, success=True, errors=[])
        except Organization.DoesNotExist:
            return UpdateProject(project=None, success=False, errors=["Organization not found"])
        except Project.DoesNotExist:
            return UpdateProject(project=None, success=False, errors=["Project not found"])
        except Exception as e:
            return UpdateProject(project=None, success=False, errors=[str(e)])


class CreateTask(graphene.Mutation):
    class Arguments:
        project_id = graphene.ID(required=True)
        title = graphene.String(required=True)
        description = graphene.String()
        status = graphene.String()
        assignee_email = graphene.String()
        due_date = graphene.DateTime()

    task = graphene.Field(TaskType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, project_id, title, description="", status="TODO", assignee_email="", due_date=None):
        try:
            project = Project.objects.get(id=project_id)
            task = Task.objects.create(
                project=project,
                title=title,
                description=description,
                status=status,
                assignee_email=assignee_email,
                due_date=due_date
            )
            return CreateTask(task=task, success=True, errors=[])
        except Project.DoesNotExist:
            return CreateTask(task=None, success=False, errors=["Project not found"])
        except Exception as e:
            return CreateTask(task=None, success=False, errors=[str(e)])


class UpdateTask(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        title = graphene.String()
        description = graphene.String()
        status = graphene.String()
        assignee_email = graphene.String()
        due_date = graphene.DateTime()

    task = graphene.Field(TaskType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, id, title=None, description=None, status=None, assignee_email=None, due_date=None):
        try:
            task = Task.objects.get(id=id)
            
            if title is not None:
                task.title = title
            if description is not None:
                task.description = description
            if status is not None:
                task.status = status
            if assignee_email is not None:
                task.assignee_email = assignee_email
            if due_date is not None:
                task.due_date = due_date
            
            task.save()
            return UpdateTask(task=task, success=True, errors=[])
        except Task.DoesNotExist:
            return UpdateTask(task=None, success=False, errors=["Task not found"])
        except Exception as e:
            return UpdateTask(task=None, success=False, errors=[str(e)])


class AddComment(graphene.Mutation):
    class Arguments:
        task_id = graphene.ID(required=True)
        content = graphene.String(required=True)
        author_email = graphene.String(required=True)

    comment = graphene.Field(TaskCommentType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, task_id, content, author_email):
        try:
            task = Task.objects.get(id=task_id)
            comment = TaskComment.objects.create(
                task=task,
                content=content,
                author_email=author_email
            )
            return AddComment(comment=comment, success=True, errors=[])
        except Task.DoesNotExist:
            return AddComment(comment=None, success=False, errors=["Task not found"])
        except Exception as e:
            return AddComment(comment=None, success=False, errors=[str(e)])


class Mutation(graphene.ObjectType):
    create_project = CreateProject.Field()
    update_project = UpdateProject.Field()
    create_task = CreateTask.Field()
    update_task = UpdateTask.Field()
    add_comment = AddComment.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)

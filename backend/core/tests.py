from django.test import TestCase
from django.contrib.auth.models import User
from .models import Organization, Project, Task, TaskComment

class GraphQLTestCase(TestCase):
    def setUp(self):
        # Create test organization
        self.org = Organization.objects.create(
            name="Test Org",
            slug="test-org",
            contact_email="test@test.com"
        )
        
        # Create test project
        self.project = Project.objects.create(
            organization=self.org,
            name="Test Project",
            description="A test project"
        )
        
        # Create test task
        self.task = Task.objects.create(
            project=self.project,
            title="Test Task",
            description="A test task"
        )
        
        # Create test comment
        self.comment = TaskComment.objects.create(
            task=self.task,
            content="Test comment",
            author_email="commenter@test.com"
        )
    
    def test_organization_creation(self):
        """Test that organizations can be created properly"""
        org = Organization.objects.get(slug="test-org")
        self.assertEqual(org.name, "Test Org")
        self.assertEqual(org.contact_email, "test@test.com")
    
    def test_project_creation(self):
        """Test that projects can be created properly"""
        project = Project.objects.get(name="Test Project")
        self.assertEqual(project.organization, self.org)
        self.assertEqual(project.description, "A test project")
    
    def test_task_creation(self):
        """Test that tasks can be created properly"""
        task = Task.objects.get(title="Test Task")
        self.assertEqual(task.project, self.project)
        self.assertEqual(task.description, "A test task")
    
    def test_comment_creation(self):
        """Test that comments can be created properly"""
        comment = TaskComment.objects.get(content="Test comment")
        self.assertEqual(comment.task, self.task)
        self.assertEqual(comment.author_email, "commenter@test.com")

# Additional tests would be added here for GraphQL queries and mutations
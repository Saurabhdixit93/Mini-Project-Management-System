"""
Script to create sample data for testing
Run with: python manage.py shell < create_sample_data.py
"""
from core.models import Organization, Project, Task, TaskComment
from datetime import datetime, timedelta

# Create organizations
org1 = Organization.objects.create(
    name="Acme Corporation",
    slug="acme-corp",
    contact_email="contact@acme.com"
)

org2 = Organization.objects.create(
    name="TechStart Inc",
    slug="techstart",
    contact_email="hello@techstart.io"
)

# Create projects for Acme Corp
project1 = Project.objects.create(
    organization=org1,
    name="Website Redesign",
    description="Complete overhaul of company website with modern design",
    status="ACTIVE",
    due_date=datetime.now().date() + timedelta(days=30)
)

project2 = Project.objects.create(
    organization=org1,
    name="Mobile App Development",
    description="iOS and Android app for customer engagement",
    status="ACTIVE",
    due_date=datetime.now().date() + timedelta(days=60)
)

project3 = Project.objects.create(
    organization=org1,
    name="Q4 Marketing Campaign",
    description="Holiday season marketing push",
    status="COMPLETED",
    due_date=datetime.now().date() - timedelta(days=10)
)

# Create projects for TechStart
project4 = Project.objects.create(
    organization=org2,
    name="MVP Development",
    description="Build minimum viable product for launch",
    status="ACTIVE",
    due_date=datetime.now().date() + timedelta(days=45)
)

# Create tasks for Website Redesign
task1 = Task.objects.create(
    project=project1,
    title="Design homepage mockup",
    description="Create high-fidelity mockup for new homepage",
    status="DONE",
    assignee_email="designer@acme.com",
    due_date=datetime.now() + timedelta(days=5)
)

task2 = Task.objects.create(
    project=project1,
    title="Implement responsive navigation",
    description="Build mobile-friendly navigation component",
    status="IN_PROGRESS",
    assignee_email="dev@acme.com",
    due_date=datetime.now() + timedelta(days=10)
)

task3 = Task.objects.create(
    project=project1,
    title="Setup CI/CD pipeline",
    description="Configure automated deployment",
    status="TODO",
    assignee_email="devops@acme.com",
    due_date=datetime.now() + timedelta(days=15)
)

# Create tasks for Mobile App
task4 = Task.objects.create(
    project=project2,
    title="Setup React Native project",
    description="Initialize project with necessary dependencies",
    status="DONE",
    assignee_email="mobile@acme.com"
)

task5 = Task.objects.create(
    project=project2,
    title="Implement user authentication",
    description="Add login and signup flows",
    status="IN_PROGRESS",
    assignee_email="mobile@acme.com"
)

# Create tasks for MVP
task6 = Task.objects.create(
    project=project4,
    title="Database schema design",
    description="Design initial database structure",
    status="DONE",
    assignee_email="backend@techstart.io"
)

task7 = Task.objects.create(
    project=project4,
    title="API development",
    description="Build RESTful API endpoints",
    status="IN_PROGRESS",
    assignee_email="backend@techstart.io"
)

# Create comments
TaskComment.objects.create(
    task=task2,
    content="Making good progress, should be done by tomorrow",
    author_email="dev@acme.com"
)

TaskComment.objects.create(
    task=task2,
    content="Looks great! Let me know if you need design feedback",
    author_email="designer@acme.com"
)

TaskComment.objects.create(
    task=task5,
    content="OAuth integration is complete, working on session management",
    author_email="mobile@acme.com"
)

print("Sample data created successfully!")
print(f"Organizations: {Organization.objects.count()}")
print(f"Projects: {Project.objects.count()}")
print(f"Tasks: {Task.objects.count()}")
print(f"Comments: {TaskComment.objects.count()}")

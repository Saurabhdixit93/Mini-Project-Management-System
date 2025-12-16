#!/usr/bin/env python
"""
Script to create sample data for the project management system.
"""

import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from core.models import Organization, Project, Task, TaskComment

def create_sample_data():
    """Create sample organizations, projects, tasks, and comments."""
    
    # Clear existing data
    TaskComment.objects.all().delete()
    Task.objects.all().delete()
    Project.objects.all().delete()
    Organization.objects.all().delete()
    
    print("Creating sample organizations...")
    
    # Create organizations
    acme = Organization.objects.create(
        name="Acme Corporation",
        slug="acme-corp",
        contact_email="contact@acme.com"
    )
    
    techstart = Organization.objects.create(
        name="TechStart Inc",
        slug="techstart",
        contact_email="hello@techstart.com"
    )
    
    print("Creating sample projects...")
    
    # Create projects for Acme
    website_project = Project.objects.create(
        organization=acme,
        name="Company Website Redesign",
        description="Redesign the company website with modern UI/UX",
        status="ACTIVE",
        due_date="2026-03-15"
    )
    
    marketing_project = Project.objects.create(
        organization=acme,
        name="Marketing Campaign",
        description="Q1 marketing campaign for product launch",
        status="ACTIVE",
        due_date="2026-02-28"
    )
    
    hr_project = Project.objects.create(
        organization=acme,
        name="HR System Upgrade",
        description="Upgrade HR management system",
        status="ON_HOLD"
    )
    
    # Create projects for TechStart
    mobile_app = Project.objects.create(
        organization=techstart,
        name="Mobile Banking App",
        description="Develop a secure mobile banking application",
        status="ACTIVE",
        due_date="2026-06-30"
    )
    
    api_development = Project.objects.create(
        organization=techstart,
        name="Payment API",
        description="RESTful API for payment processing",
        status="COMPLETED"
    )
    
    print("Creating sample tasks...")
    
    # Create tasks for website project
    task1 = Task.objects.create(
        project=website_project,
        title="Design Homepage Layout",
        description="Create wireframes and mockups for homepage",
        status="DONE",
        assignee_email="designer@acme.com",
        due_date="2026-01-15"
    )
    
    task2 = Task.objects.create(
        project=website_project,
        title="Implement Responsive Design",
        description="Ensure website works on all device sizes",
        status="IN_PROGRESS",
        assignee_email="developer@acme.com"
    )
    
    task3 = Task.objects.create(
        project=website_project,
        title="SEO Optimization",
        description="Optimize website for search engines",
        status="TODO",
        assignee_email="seo@acme.com"
    )
    
    # Create tasks for mobile app project
    task4 = Task.objects.create(
        project=mobile_app,
        title="User Authentication",
        description="Implement secure user login and registration",
        status="IN_PROGRESS",
        assignee_email="auth@techstart.com"
    )
    
    task5 = Task.objects.create(
        project=mobile_app,
        title="Payment Processing",
        description="Integrate payment gateway",
        status="TODO",
        assignee_email="payments@techstart.com"
    )
    
    print("Creating sample comments...")
    
    # Create comments
    TaskComment.objects.create(
        task=task1,
        content="Homepage design looks great! Just a few minor adjustments needed.",
        author_email="manager@acme.com"
    )
    
    TaskComment.objects.create(
        task=task1,
        content="Thanks for the feedback. I'll make those changes by Friday.",
        author_email="designer@acme.com"
    )
    
    TaskComment.objects.create(
        task=task2,
        content="Having some issues with the mobile menu. Need to discuss approach.",
        author_email="developer@acme.com"
    )
    
    print("Sample data created successfully!")
    print("\nOrganizations:")
    for org in Organization.objects.all():
        print(f"  - {org.name} ({org.slug})")
        
    print("\nProjects:")
    for project in Project.objects.all():
        print(f"  - {project.name} ({project.status}) - {project.organization.name}")
        
    print("\nTasks:")
    for task in Task.objects.all()[:5]:
        print(f"  - {task.title} ({task.status}) - {task.project.name}")

if __name__ == "__main__":
    create_sample_data()